// ==============================
// 📁 src/db/theater.repo.js
// Quản lý RẠP (Theater) và PHÒNG CHIẾU (Screen)
// ==============================

import {
  addScreenToFirebase,
  addTheaterToFirebase,
  deleteScreenFromFirebase,
  deleteTheaterFromFirebase,
  updateScreenInFirebase,
  updateTheaterInFirebase,
} from "../cloud/sync-manager";
import { getDB } from "./init";
import { generateFirebaseId } from "./utils"; // Fixed import path from ../utils/firebase-utils to ./utils
const { rowNumberToLetter } = require("../utils/row-converter");

// ==============================
// 🎭 THEATERS (Rạp chiếu phim)
// ==============================

// 1️⃣ Thêm rạp
export async function addTheater(theater, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const id = theater.id || generateFirebaseId();
    const { name, location } = theater;
    if (!name?.trim()) throw new Error("Tên rạp là bắt buộc!");

    await db.runAsync(
      `INSERT INTO theaters (id, name, location) VALUES (?, ?, ?);`,
      [id, name.trim(), location?.trim() || ""]
    );

    const newTheater = await db.getFirstAsync(
      "SELECT * FROM theaters WHERE id = ?;",
      [id]
    );

    if (newTheater) {
      await addTheaterToFirebase(newTheater);
    }

    console.log("✅ Thêm rạp mới thành công!");
    onSuccess && onSuccess(newTheater?.id);
  } catch (err) {
    console.error("❌ Lỗi khi thêm rạp:", err);
    onError && onError(err);
  }
}

// 2️⃣ Lấy danh sách rạp
export async function getTheaters(onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const rows = await db.getAllAsync(
      `SELECT * FROM theaters ORDER BY name ASC;`
    );
    console.log(`🎭 Lấy ${rows.length} rạp từ DB`);
    onSuccess && onSuccess(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách rạp:", err);
    onError && onError(err);
  }
}

// 3️⃣ Lấy chi tiết rạp
export async function getTheaterById(id, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const theater = await db.getFirstAsync(
      "SELECT * FROM theaters WHERE id = ?;",
      [id]
    );
    if (theater) onSuccess && onSuccess(theater);
    else onError && onError("Không tìm thấy rạp.");
  } catch (err) {
    console.error("❌ Lỗi khi lấy rạp:", err);
    onError && onError(err);
  }
}

// 4️⃣ Cập nhật rạp
export async function updateTheater(theater, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");
    if (!theater.id) throw new Error("Thiếu ID rạp!");

    const existingTheater = await db.getFirstAsync(
      "SELECT * FROM theaters WHERE id = ?",
      [theater.id]
    );
    if (!existingTheater) {
      throw new Error("Rạp không tồn tại trong database!");
    }

    const theaterData = {
      id: String(theater.id),
      name: (theater.name || existingTheater.name).trim(),
      location: (theater.location || existingTheater.location || "").trim(),
    };

    await db.runAsync(
      `UPDATE theaters SET name = ?, location = ? WHERE id = ?;`,
      [theaterData.name, theaterData.location, theaterData.id]
    );

    await updateTheaterInFirebase(theaterData);

    console.log("✏️ Cập nhật rạp thành công!");
    onSuccess && onSuccess();
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật rạp:", err);
    onError && onError(err);
  }
}

// 5️⃣ Xóa rạp (kèm phòng chiếu)
export async function deleteTheater(id, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const theaterId = String(id);

    const showtimes = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM showtimes s
       JOIN screens sc ON s.screen_id = sc.id
       WHERE sc.theater_id = ?;`,
      [theaterId]
    );
    const showtimeCount = showtimes[0]?.count || 0;

    if (showtimeCount > 0) {
      throw new Error(
        "❌ Không thể xóa rạp vì có lịch chiếu. Hãy xóa lịch chiếu trước!"
      );
    }

    const bookings = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN screens sc ON s.screen_id = sc.id
       WHERE sc.theater_id = ?;`,
      [theaterId]
    );
    const bookingCount = bookings[0]?.count || 0;

    if (bookingCount > 0) {
      throw new Error(
        "❌ Không thể xóa rạp vì có người đặt vé. Hãy hủy đơn đặt trước!"
      );
    }

    const screens = await db.getAllAsync(
      "SELECT * FROM screens WHERE theater_id = ?;",
      [theaterId]
    );

    for (const screen of screens) {
      await deleteScreenFromFirebase(screen.id);
    }

    await deleteTheaterFromFirebase(theaterId);

    await db.execAsync(
      `DELETE FROM screens WHERE theater_id = '${theaterId}';
       DELETE FROM theaters WHERE id = '${theaterId}';`
    );

    console.log("🗑️ Đã xóa rạp và các phòng chiếu liên quan!");
    onSuccess && onSuccess();
  } catch (err) {
    console.error("❌ Lỗi khi xóa rạp:", err);
    onError && onError(err);
  }
}

// ==============================
// 🎞️ SCREENS (Phòng chiếu)
// ==============================

// 1️⃣ Thêm phòng chiếu
export async function addScreen(screen, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const id = screen.id || generateFirebaseId();
    const { theater_id, name, rows, cols } = screen;
    if (!theater_id || !name?.trim())
      throw new Error("Thiếu thông tin bắt buộc!");
    if (!rows || !cols) throw new Error("Cần số hàng và số cột ghế!");

    const seat_map = {};
    for (let i = 0; i < rows; i++) {
      const rowLetter = rowNumberToLetter(i + 1);
      seat_map[rowLetter] = Array(cols).fill(1);
    }

    await db.runAsync(
      `INSERT INTO screens (id, theater_id, name, rows, cols, seat_map) VALUES (?, ?, ?, ?, ?, ?);`,
      [id, theater_id, name.trim(), rows, cols, JSON.stringify(seat_map)]
    );

    const newScreen = await db.getFirstAsync(
      "SELECT * FROM screens WHERE id = ?;",
      [id]
    );

    if (newScreen) {
      await addScreenToFirebase(newScreen);
    }

    console.log("✅ Thêm phòng chiếu thành công!");
    onSuccess && onSuccess(newScreen?.id);
  } catch (err) {
    console.error("❌ Lỗi khi thêm phòng chiếu:", err);
    onError && onError(err);
  }
}

// 2️⃣ Lấy danh sách phòng chiếu theo rạp
export async function getScreensByTheater(theaterId, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const rows = await db.getAllAsync(
      "SELECT * FROM screens WHERE theater_id = ? ORDER BY name ASC;",
      [theaterId]
    );

    console.log(`🎦 Lấy ${rows.length} phòng chiếu của rạp ${theaterId}`);
    onSuccess && onSuccess(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách phòng chiếu:", err);
    onError && onError(err);
  }
}

// 3️⃣ Cập nhật phòng chiếu
export async function updateScreen(screen, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");
    if (!screen.id) throw new Error("Thiếu ID phòng chiếu!");

    await db.runAsync(
      `UPDATE screens
       SET name = ?, rows = ?, cols = ?, seat_map = ?
       WHERE id = ?;`,
      [
        screen.name.trim(),
        screen.rows,
        screen.cols,
        JSON.stringify(screen.seat_map || []),
        screen.id,
      ]
    );

    await updateScreenInFirebase(screen);

    console.log("✏️ Cập nhật phòng chiếu thành công!");
    onSuccess && onSuccess();
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật phòng chiếu:", err);
    onError && onError(err);
  }
}

// 4️⃣ Xóa phòng chiếu
export async function deleteScreen(id, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const screenId = String(id);

    const showtimes = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM showtimes WHERE screen_id = ?;",
      [screenId]
    );
    const showtimeCount = showtimes[0]?.count || 0;

    if (showtimeCount > 0) {
      throw new Error(
        "❌ Không thể xóa phòng vì có lịch chiếu. Hãy xóa lịch chiếu trước!"
      );
    }

    const bookings = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       WHERE s.screen_id = ?;`,
      [screenId]
    );
    const bookingCount = bookings[0]?.count || 0;

    if (bookingCount > 0) {
      throw new Error(
        "❌ Không thể xóa phòng vì có người đặt vé. Hãy hủy đơn đặt trước!"
      );
    }

    await deleteScreenFromFirebase(screenId);

    await db.runAsync("DELETE FROM screens WHERE id = ?;", [screenId]);
    console.log("🗑️ Xóa phòng chiếu thành công!");
    onSuccess && onSuccess();
  } catch (err) {
    console.error("❌ Lỗi khi xóa phòng chiếu:", err);
    onError && onError(err);
  }
}
