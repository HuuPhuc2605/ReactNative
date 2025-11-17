// ==============================
// 📁 src/db/showtime.repo.js
// Quản lý suất chiếu (Showtimes)
// CRUD đầy đủ, sử dụng API async mới của expo-sqlite
// ==============================

import { addShowtimeToFirebase, deleteShowtimeFromFirebase, updateShowtimeInFirebase } from "../cloud/sync-manager";
import { getDB } from "./init";
import { generateFirebaseId } from "./utils"; // Fixed import path from ../utils/firebase-utils to ./utils

// ==============================
// 🎬 SHOWTIMES (Suất chiếu)
// ==============================

// 1️⃣ Thêm suất chiếu
export async function addShowtime(showtime, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const id = showtime.id || generateFirebaseId()
    const { movie_id, screen_id, start_time, price } = showtime
    if (!movie_id || !screen_id || !start_time || !price) {
      throw new Error("Thiếu thông tin bắt buộc!")
    }
    if (price < 0) throw new Error("Giá vé không hợp lệ!")

    await db.runAsync(
      `INSERT INTO showtimes (id, movie_id, screen_id, start_time, price, status) VALUES (?, ?, ?, ?, ?, ?);`,
      [id, movie_id, screen_id, start_time, price, "active"],
    )

    const newShowtime = await db.getFirstAsync(
      `SELECT st.id, st.movie_id, st.screen_id, st.start_time, st.price, st.status,
              m.title as movie_title, th.name as theater_name, s.name as screen_name
       FROM showtimes st
       LEFT JOIN movies m ON st.movie_id = m.id
       LEFT JOIN screens s ON st.screen_id = s.id
       LEFT JOIN theaters th ON s.theater_id = th.id
       WHERE st.id = ?;`,
      [id],
    )

    if (newShowtime) {
      await addShowtimeToFirebase(newShowtime)
    }

    console.log("✅ Thêm suất chiếu thành công!")
    onSuccess && onSuccess(newShowtime?.id)
  } catch (err) {
    console.error("❌ Lỗi khi thêm suất chiếu:", err)
    onError && onError(err)
  }
}

// 2️⃣ Lấy danh sách suất chiếu
export async function getShowtimes(onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const rows = await db.getAllAsync(`
      SELECT 
        st.id, 
        st.movie_id, 
        st.screen_id, 
        st.start_time, 
        st.price, 
        st.status,
        st.booked_seats,
        m.title as movie_title,
        th.name as theater_name,
        s.name as screen_name
      FROM showtimes st
      LEFT JOIN movies m ON st.movie_id = m.id
      LEFT JOIN screens s ON st.screen_id = s.id
      LEFT JOIN theaters th ON s.theater_id = th.id
      ORDER BY st.start_time ASC;
    `)

    console.log(`🎬 Lấy ${rows.length} suất chiếu từ DB`)
    onSuccess && onSuccess(rows)
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách suất chiếu:", err)
    onError && onError(err)
  }
}

// 3️⃣ Lấy chi tiết suất chiếu theo ID
export async function getShowtimeById(id, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtimeId = String(id)

    const showtime = await db.getFirstAsync(
      `
      SELECT 
        st.id, 
        st.movie_id, 
        st.screen_id, 
        st.start_time, 
        st.price, 
        st.status,
        st.booked_seats,
        m.title as movie_title,
        th.name as theater_name,
        s.name as screen_name,
        s.theater_id
      FROM showtimes st
      LEFT JOIN movies m ON st.movie_id = m.id
      LEFT JOIN screens s ON st.screen_id = s.id
      LEFT JOIN theaters th ON s.theater_id = th.id
      WHERE st.id = ?;
    `,
      [showtimeId],
    )

    if (showtime) {
      onSuccess && onSuccess(showtime)
    } else {
      onError && onError("Không tìm thấy suất chiếu.")
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy suất chiếu:", err)
    onError && onError(err)
  }
}

// 4️⃣ Cập nhật suất chiếu
export async function updateShowtime(showtime, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")
    if (!showtime.id) throw new Error("Thiếu ID suất chiếu!")
    if (showtime.price < 0) throw new Error("Giá vé không hợp lệ!")

    const existingShowtime = await db.getFirstAsync(
      `SELECT st.id, st.movie_id, st.screen_id, st.start_time, st.price, st.status,
              m.title as movie_title, th.name as theater_name, s.name as screen_name
       FROM showtimes st
       LEFT JOIN movies m ON st.movie_id = m.id
       LEFT JOIN screens s ON st.screen_id = s.id
       LEFT JOIN theaters th ON s.theater_id = th.id
       WHERE st.id = ?;`,
      [showtime.id]
    );

    if (!existingShowtime) {
      throw new Error("Suất chiếu không tồn tại trong database!");
    }

    const showtimeData = {
      id: String(showtime.id),
      movie_id: showtime.movie_id || existingShowtime.movie_id,
      screen_id: showtime.screen_id || existingShowtime.screen_id,
      start_time: showtime.start_time || existingShowtime.start_time,
      price:
        showtime.price !== undefined ? showtime.price : existingShowtime.price,
      status: showtime.status || existingShowtime.status || "active",
      movie_title: existingShowtime.movie_title || "",
      theater_name: existingShowtime.theater_name || "",
      screen_name: existingShowtime.screen_name || "",
    };

    await db.runAsync(
      `UPDATE showtimes SET movie_id = ?, screen_id = ?, start_time = ?, price = ?, status = ? WHERE id = ?;`,
      [
        showtimeData.movie_id,
        showtimeData.screen_id,
        showtimeData.start_time,
        showtimeData.price,
        showtimeData.status,
        showtimeData.id,
      ],
    )

    await updateShowtimeInFirebase(showtimeData)

    console.log("✏️ Cập nhật suất chiếu thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật suất chiếu:", err)
    onError && onError(err)
  }
}

// 5️⃣ Xóa suất chiếu
export async function deleteShowtime(id, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtimeId = String(id)

    const bookings = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM bookings WHERE showtime_id = ?;",
      [showtimeId]
    );
    const bookingCount = bookings[0]?.count || 0;

    if (bookingCount > 0) {
      throw new Error(
        "❌ Không thể xóa suất chiếu vì có người đặt vé. Hãy hủy đơn đặt trước!"
      );
    }

    await deleteShowtimeFromFirebase(showtimeId)

    await db.runAsync("DELETE FROM showtimes WHERE id = ?;", [showtimeId])
    console.log("🗑️ Xóa suất chiếu thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi xóa suất chiếu:", err)
    onError && onError(err)
  }
}

// 6️⃣ Lấy danh sách suất chiếu theo phim
export async function getShowtimesByMovieId(movieId, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const rows = await db.getAllAsync(
      `
      SELECT 
        st.id, 
        st.movie_id, 
        st.screen_id, 
        st.start_time, 
        st.price, 
        st.status,
        st.booked_seats,
        m.title as movie_title,
        th.name as theater_name,
        s.name as screen_name
      FROM showtimes st
      LEFT JOIN movies m ON st.movie_id = m.id
      LEFT JOIN screens s ON st.screen_id = s.id
      LEFT JOIN theaters th ON s.theater_id = th.id
      WHERE st.movie_id = ?
      ORDER BY st.start_time ASC;
    `,
      [movieId],
    )

    onSuccess && onSuccess(rows)
  } catch (err) {
    console.error("❌ Lỗi khi lấy suất chiếu theo phim:", err)
    onError && onError(err)
  }
}

// 7️⃣ Lấy danh sách suất chiếu theo phòng chiếu
export async function getShowtimesByScreenId(screenId, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const rows = await db.getAllAsync(
      `
      SELECT 
        st.id, 
        st.movie_id, 
        st.screen_id, 
        st.start_time, 
        st.price, 
        st.status,
        st.booked_seats,
        m.title as movie_title,
        th.name as theater_name
      FROM showtimes st
      LEFT JOIN movies m ON st.movie_id = m.id
      LEFT JOIN screens s ON st.screen_id = s.id
      LEFT JOIN theaters th ON s.theater_id = th.id
      WHERE st.screen_id = ?
      ORDER BY st.start_time ASC;
    `,
      [screenId],
    )

    onSuccess && onSuccess(rows)
  } catch (err) {
    console.error("❌ Lỗi khi lấy suất chiếu theo phòng:", err)
    onError && onError(err)
  }
}

// 8️⃣ Hủy suất chiếu (chuyển sang trạng thái cancelled)
export async function cancelShowtime(id, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    await db.runAsync(`UPDATE showtimes SET status = ? WHERE id = ?;`, ["cancelled", id])

    console.log("❌ Hủy suất chiếu thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi hủy suất chiếu:", err)
    onError && onError(err)
  }
}
