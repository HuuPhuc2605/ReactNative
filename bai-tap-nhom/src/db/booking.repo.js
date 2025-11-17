// ==============================
// 📁 src/db/booking.repo.js
// Quản lý dữ liệu đặt vé (Bookings) trong SQLite
// Dành cho Customer (xem danh sách booking của mình)
// ==============================

import {
  addBookingToFirebase,
  addToSyncQueue,
  canBookingOffline,
  deleteBookingFromFirebase,
  isNetworkOnline,
  updateBookingInFirebase,
  updateShowtimeInFirebase,
} from "../cloud/sync-manager"
import { getDB } from "./init"
import { generateFirebaseId } from "./utils"

// ==============================
// 🔍 Check what user_names exist in database (DEBUG)
// ==============================
export async function getBookingUserNames(onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const result = await db.getAllAsync(
      `SELECT DISTINCT user_name, COUNT(*) as count FROM bookings GROUP BY user_name;`,
    )

    console.log("[v0] 🔍 User names in bookings table:", result)
    onSuccess && onSuccess(result)
  } catch (err) {
    console.error("[v0] ❌ Lỗi khi lấy user_names:", err)
    onError && onError(err)
  }
}

// ==============================
// 1️⃣ Lấy danh sách booking của user
// ==============================
export async function getUserBookings(userName, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const bookings = await db.getAllAsync(
      `SELECT 
        b.id,
        b.showtime_id,
        b.user_name,
        b.seats,
        b.total_price,
        b.created_at,
        b.status,
        m.title,
        m.posterUrl,
        m.genre,
        m.duration,
        m.rating,
        s.start_time,
        th.name as theater_name,
        sc.name as screen_name
      FROM bookings b
      LEFT JOIN showtimes s ON b.showtime_id = s.id
      LEFT JOIN movies m ON s.movie_id = m.id
      LEFT JOIN screens sc ON s.screen_id = sc.id
      LEFT JOIN theaters th ON sc.theater_id = th.id
      WHERE b.user_name = ?
      ORDER BY b.created_at DESC;`,
      [userName],
    )

    console.log(`📋 Lấy ${bookings.length} booking từ DB`)
    onSuccess && onSuccess(bookings)
  } catch (err) {
    console.error("❌ Lỗi khi lấy booking:", err)
    onError && onError(err)
  }
}

// ==============================
// 2️⃣ Lấy chi tiết 1 booking
// ==============================
export async function getBookingById(bookingId, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const booking = await db.getFirstAsync(
      `SELECT 
        b.*,
        m.title,
        m.posterUrl,
        m.genre,
        m.duration,
        m.rating,
        s.start_time,
        th.name as theater_name,
        sc.name as screen_name
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN theaters th ON sc.theater_id = th.id
      WHERE b.id = ?;`,
      [bookingId],
    )

    if (booking) onSuccess && onSuccess(booking)
    else onError && onError("Không tìm thấy booking.")
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết booking:", err)
    onError && onError(err)
  }
}

// ==============================
// 3️⃣ Thêm booking mới
// ==============================
export async function addBooking(booking, onSuccess, onError) {
  try {
    if (!canBookingOffline()) {
      throw new Error("❌ Không thể đặt vé khi offline. Hãy kiểm tra kết nối mạng!")
    }

    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const id = booking.id || generateFirebaseId()
    let { user_name, showtime_id, seats, total_price } = booking

    if (!showtime_id || !seats || seats.length === 0) {
      throw new Error("❌ Thiếu thông tin booking!")
    }

    const seatCheck = await checkSeatsAvailable(showtime_id, seats)
    if (!seatCheck.isAvailable) {
      throw new Error(`❌ Ghế không khả dụng: ${seatCheck.unavailableSeats.join(", ")}. Vui lòng chọn ghế khác.`)
    }

    user_name = user_name && typeof user_name === "string" ? user_name.trim() : null

    if (!user_name || user_name === "") {
      console.warn("[v0] ⚠️ user_name is empty, defaulting to 'customer'")
      user_name = "customer"
    }

    console.log("[v0] Inserting booking with user_name:", user_name, "type:", typeof user_name)

    const result = await db.runAsync(
      `INSERT INTO bookings (id, showtime_id, user_name, seats, total_price, created_at, status)
       VALUES (?, ?, ?, ?, ?, datetime('now'), 'booked');`,
      [id, showtime_id, user_name, JSON.stringify(seats), total_price],
    )

    const newBooking = await db.getFirstAsync(
      `SELECT id, showtime_id, user_name, seats, total_price, created_at, status 
       FROM bookings 
       WHERE id = ?;`,
      [id],
    )

    await updateScreenSeatMap(showtime_id, seats)
    await updateShowtimeBookedSeats(showtime_id, seats)

    const updatedShowtime = await db.getFirstAsync(
      `SELECT s.id, s.movie_id, s.screen_id, s.start_time, s.price, s.status, s.booked_seats,
              m.title as movie_title, th.name as theater_name, sc.name as screen_name
       FROM showtimes s
       LEFT JOIN movies m ON s.movie_id = m.id
       LEFT JOIN screens sc ON s.screen_id = sc.id
       LEFT JOIN theaters th ON sc.theater_id = th.id
       WHERE s.id = ?;`,
      [showtime_id],
    )

    if (isNetworkOnline()) {
      try {
        await addBookingToFirebase(newBooking)
        console.log("[v0] ✅ Booking uploaded to Firebase successfully")
        
        if (updatedShowtime) {
          await updateShowtimeInFirebase(updatedShowtime)
          console.log("[v0] ✅ Updated showtime with new booked_seats synced to Firebase")
        }
      } catch (cloudErr) {
        console.warn("[v0] ⚠️ Failed to upload booking immediately, added to sync queue:", cloudErr)
        addToSyncQueue("add", "booking", newBooking)
        if (updatedShowtime) {
          addToSyncQueue("update", "showtime", updatedShowtime)
        }
      }
    } else {
      console.log("[v0] 📦 Offline: Added booking to sync queue")
      addToSyncQueue("add", "booking", newBooking)
      if (updatedShowtime) {
        addToSyncQueue("update", "showtime", updatedShowtime)
      }
    }

    console.log("✅ Thêm booking mới thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi thêm booking:", err)
    onError && onError(err)
  }
}

// ==============================
// 🔄 Migrate old bookings to current user email
// ==============================
export async function migrateBookingsToUser(oldUserName, newUserName, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const result = await db.runAsync(`UPDATE bookings SET user_name = ? WHERE user_name = ?;`, [
      newUserName,
      oldUserName,
    ])

    console.log(`[v0] ✅ Migrated bookings from ${oldUserName} to ${newUserName}, rows affected: ${result.changes}`)
    onSuccess && onSuccess(result.changes)
  } catch (err) {
    console.error("[v0] ❌ Lỗi khi migrate bookings:", err)
    onError && onError(err)
  }
}

// ==============================
// 6️⃣ Lấy tất cả booking (dành cho admin)
// ==============================
export async function getAllBookings(onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const bookings = await db.getAllAsync(
      `SELECT 
        b.id,
        b.showtime_id,
        b.user_name,
        b.seats,
        b.total_price,
        b.created_at,
        b.status,
        m.title as movie_title,
        m.duration,
        s.start_time,
        th.name as theater_name,
        sc.name as screen_name
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN theaters th ON sc.theater_id = th.id
      ORDER BY b.created_at DESC;`,
    )

    console.log(`[v0] Lấy ${bookings.length} booking từ DB`)
    onSuccess(bookings)
  } catch (err) {
    console.error("[v0] Lỗi khi lấy booking:", err)
    onError(err)
  }
}

// ==============================
// 6️⃣ Cập nhật seat_map khi đặt vé
// ==============================
export async function updateScreenSeatMap(showtimeId, bookedSeats) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtime = await db.getFirstAsync(
      `SELECT s.screen_id, sc.seat_map FROM showtimes s
       JOIN screens sc ON s.screen_id = sc.id
       WHERE s.id = ?;`,
      [showtimeId],
    )

    if (!showtime) throw new Error("Không tìm thấy suất chiếu")

    const seatMap = JSON.parse(showtime.seat_map)

    bookedSeats.forEach((seatCode) => {
      const row = seatCode.charAt(0) // 'A', 'B', etc
      const col = Number.parseInt(seatCode.substring(1)) - 1 // Convert to 0-indexed
      if (seatMap[row] && seatMap[row][col] !== undefined) {
        seatMap[row][col] = 2 // 2 = booked
      }
    })

    await db.runAsync(`UPDATE screens SET seat_map = ? WHERE id = ?;`, [JSON.stringify(seatMap), showtime.screen_id])

    console.log("✅ Cập nhật seat_map thành công!")
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật seat_map:", err)
    throw err
  }
}

// ==============================
// 4️⃣ Cập nhật trạng thái booking
// ==============================
export async function updateBookingStatus(bookingId, status, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    await db.runAsync(`UPDATE bookings SET status = ? WHERE id = ?;`, [status, bookingId])

    const updatedBooking = await db.getFirstAsync(
      `SELECT id, showtime_id, user_name, seats, total_price, created_at, status FROM bookings WHERE id = ?;`,
      [bookingId],
    )

    if (updatedBooking && isNetworkOnline()) {
      try {
        await updateBookingInFirebase(updatedBooking)
        console.log("[v0] ✅ Booking status updated in Firebase")
      } catch (cloudErr) {
        console.warn("[v0] ⚠️ Failed to update booking in Firebase:", cloudErr)
        addToSyncQueue("update", "booking", updatedBooking)
      }
    } else if (updatedBooking) {
      addToSyncQueue("update", "booking", updatedBooking)
    }

    console.log("✏️ Cập nhật trạng thái booking thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật booking:", err)
    onError && onError(err)
  }
}

// ==============================
// 5️⃣ Xóa booking và hoàn trả ghế
// ==============================
export async function cancelBooking(bookingId, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    // Get booking details including seats and showtime_id
    const booking = await db.getFirstAsync(
      `SELECT id, showtime_id, seats, status FROM bookings WHERE id = ?;`,
      [bookingId],
    )

    if (!booking) throw new Error("Không tìm thấy booking")

    // If already cancelled, don't process again
    if (booking.status === "cancelled") {
      throw new Error("Booking đã được hủy trước đó")
    }

    // Parse seats from booking
    let seatsToRemove = []
    try {
      const parsed = typeof booking.seats === "string" 
        ? JSON.parse(booking.seats)
        : booking.seats
      seatsToRemove = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error("[v0] Error parsing seats:", e)
    }

    await db.runAsync(
      `UPDATE bookings SET status = ? WHERE id = ?;`,
      ["cancelled", bookingId]
    )

    if (seatsToRemove.length > 0) {
      await removeSeatsFromShowtime(booking.showtime_id, seatsToRemove)
      await restoreScreenSeats(booking.showtime_id, seatsToRemove)
    }

    // Get updated showtime to sync to Firebase
    const updatedShowtime = await db.getFirstAsync(
      `SELECT s.id, s.movie_id, s.screen_id, s.start_time, s.price, s.status, s.booked_seats,
              m.title as movie_title, th.name as theater_name, sc.name as screen_name
       FROM showtimes s
       LEFT JOIN movies m ON s.movie_id = m.id
       LEFT JOIN screens sc ON s.screen_id = sc.id
       LEFT JOIN theaters th ON sc.theater_id = th.id
       WHERE s.id = ?;`,
      [booking.showtime_id],
    )

    // Get updated booking
    const updatedBooking = await db.getFirstAsync(
      `SELECT id, showtime_id, user_name, seats, total_price, created_at, status FROM bookings WHERE id = ?;`,
      [bookingId],
    )

    // Sync updated booking and showtime to Firebase
    if (isNetworkOnline()) {
      try {
        await updateBookingInFirebase(updatedBooking)
        console.log("[v0] ✅ Cancelled booking synced to Firebase")
        
        if (updatedShowtime) {
          await updateShowtimeInFirebase(updatedShowtime)
          console.log("[v0] ✅ Updated showtime with removed seats synced to Firebase")
        }
      } catch (cloudErr) {
        console.warn("[v0] ⚠️ Failed to sync cancellation to Firebase:", cloudErr)
        addToSyncQueue("update", "booking", updatedBooking)
        if (updatedShowtime) {
          addToSyncQueue("update", "showtime", updatedShowtime)
        }
      }
    } else {
      console.log("[v0] 📦 Offline: Added cancellation to sync queue")
      addToSyncQueue("update", "booking", updatedBooking)
      if (updatedShowtime) {
        addToSyncQueue("update", "showtime", updatedShowtime)
      }
    }

    console.log("✅ Hủy booking thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi hủy booking:", err)
    onError && onError(err)
  }
}

// ==============================
// Helper: Remove seats from booked_seats
// ==============================
export async function removeSeatsFromShowtime(showtimeId, seatsToRemove) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtime = await db.getFirstAsync(
      `SELECT booked_seats FROM showtimes WHERE id = ?;`,
      [showtimeId],
    )

    if (!showtime) throw new Error("Không tìm thấy suất chiếu")

    let currentBookedSeats = []
    try {
      const parsed = typeof showtime.booked_seats === "string"
        ? JSON.parse(showtime.booked_seats)
        : showtime.booked_seats
      currentBookedSeats = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error(`[v0] Error parsing current booked_seats:`, e)
      currentBookedSeats = []
    }

    // Remove the seats from booked_seats
    const updatedBookedSeats = currentBookedSeats.filter(
      seat => !seatsToRemove.includes(seat)
    )

    console.log(`[v0] Removing seats from showtime ${showtimeId}:`)
    console.log(`[v0] Previous: ${JSON.stringify(currentBookedSeats)}`)
    console.log(`[v0] Removing: ${JSON.stringify(seatsToRemove)}`)
    console.log(`[v0] Result: ${JSON.stringify(updatedBookedSeats)}`)

    await db.runAsync(
      `UPDATE showtimes SET booked_seats = ? WHERE id = ?;`,
      [JSON.stringify(updatedBookedSeats), showtimeId],
    )

    console.log("[v0] ✅ Removed seats from booked_seats for showtime:", showtimeId)
  } catch (err) {
    console.error("[v0] ❌ Lỗi khi loại bỏ ghế:", err)
    throw err
  }
}

// ==============================
// Helper: Restore screen seats to available status
// ==============================
export async function restoreScreenSeats(showtimeId, seatsToRestore) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtime = await db.getFirstAsync(
      `SELECT s.screen_id, sc.seat_map FROM showtimes s
       JOIN screens sc ON s.screen_id = sc.id
       WHERE s.id = ?;`,
      [showtimeId],
    )

    if (!showtime) throw new Error("Không tìm thấy suất chiếu")

    const seatMap = JSON.parse(showtime.seat_map)

    seatsToRestore.forEach((seatCode) => {
      const row = seatCode.charAt(0)
      const col = Number.parseInt(seatCode.substring(1)) - 1
      if (seatMap[row] && seatMap[row][col] !== undefined) {
        seatMap[row][col] = 1 // 1 = available
        console.log(`[v0] Restored seat ${seatCode} to available`)
      }
    })

    await db.runAsync(
      `UPDATE screens SET seat_map = ? WHERE id = ?;`,
      [JSON.stringify(seatMap), showtime.screen_id]
    )

    console.log("[v0] ✅ Restored screen seats successfully!")
  } catch (err) {
    console.error("[v0] ❌ Lỗi khi khôi phục ghế:", err)
    throw err
  }
}

// ==============================
// OLD: Xóa booking (keep for compatibility but deprecate)
// ==============================
export async function deleteBooking(bookingId, onSuccess, onError) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    if (isNetworkOnline()) {
      try {
        await deleteBookingFromFirebase(bookingId)
        console.log("[v0] ✅ Booking deleted from Firebase")
      } catch (cloudErr) {
        console.warn("[v0] ⚠️ Failed to delete booking from Firebase:", cloudErr)
        addToSyncQueue("delete", "booking", { id: bookingId })
      }
    } else {
      addToSyncQueue("delete", "booking", { id: bookingId })
    }

    await db.runAsync(`DELETE FROM bookings WHERE id = ?;`, [bookingId])

    console.log("🗑️ Xóa booking thành công!")
    onSuccess && onSuccess()
  } catch (err) {
    console.error("❌ Lỗi khi xóa booking:", err)
    onError && onError(err)
  }
}

// ==============================
// ==============================
export async function checkSeatsAvailable(showtimeId, requestedSeats) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtime = await db.getFirstAsync(
      `SELECT st.screen_id, sc.seat_map, st.booked_seats FROM showtimes st
       JOIN screens sc ON st.screen_id = sc.id
       WHERE st.id = ?;`,
      [showtimeId],
    )

    if (!showtime) {
      throw new Error("Không tìm thấy suất chiếu")
    }

    const seatMap = JSON.parse(showtime.seat_map)
    
    let bookedSeatsArray = [];
    try {
      const parsed = typeof showtime.booked_seats === 'string' 
        ? JSON.parse(showtime.booked_seats)
        : showtime.booked_seats;
      bookedSeatsArray = Array.isArray(parsed) ? parsed : [];
      console.log(`[v0] Parsed booked_seats from DB:`, bookedSeatsArray);
    } catch (e) {
      console.error(`[v0] Error parsing booked_seats in checkSeatsAvailable:`, e);
      bookedSeatsArray = [];
    }
    
    const unavailableSeats = []

    requestedSeats.forEach((seatCode) => {
      if (bookedSeatsArray.includes(seatCode)) {
        console.log(`[v0] Seat ${seatCode} is in booked_seats array`);
        unavailableSeats.push(seatCode)
        return
      }

      const row = seatCode.charAt(0) // 'A', 'B', etc
      const col = Number.parseInt(seatCode.substring(1)) - 1 // Convert to 0-indexed

      if (!seatMap[row] || seatMap[row][col] === undefined) {
        console.log(`[v0] Seat ${seatCode} does not exist in seat_map`);
        unavailableSeats.push(seatCode)
      } else if (seatMap[row][col] !== 1) {
        console.log(`[v0] Seat ${seatCode} has status ${seatMap[row][col]} in seat_map`);
        unavailableSeats.push(seatCode)
      }
    })

    console.log(`[v0] checkSeatsAvailable result - Available: ${unavailableSeats.length === 0}, Unavailable: ${unavailableSeats.join(',')}`);
    return {
      isAvailable: unavailableSeats.length === 0,
      unavailableSeats: unavailableSeats,
    }
  } catch (err) {
    console.error("[v0] ❌ Lỗi khi kiểm tra ghế:", err)
    throw err
  }
}

// ==============================
// ==============================
export async function updateShowtimeBookedSeats(showtimeId, newBookedSeats) {
  try {
    const db = getDB()
    if (!db) throw new Error("Database chưa sẵn sàng")

    const showtime = await db.getFirstAsync(
      `SELECT booked_seats FROM showtimes WHERE id = ?;`,
      [showtimeId],
    )

    if (!showtime) throw new Error("Không tìm thấy suất chiếu")

    let currentBookedSeats = [];
    try {
      const parsed = typeof showtime.booked_seats === 'string'
        ? JSON.parse(showtime.booked_seats)
        : showtime.booked_seats;
      currentBookedSeats = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error(`[v0] Error parsing current booked_seats:`, e);
      currentBookedSeats = [];
    }

    const updatedBookedSeats = [...new Set([...currentBookedSeats, ...newBookedSeats])];
    
    console.log(`[v0] Updating booked_seats for showtime ${showtimeId}:`);
    console.log(`[v0] Previous: ${JSON.stringify(currentBookedSeats)}`);
    console.log(`[v0] Adding: ${JSON.stringify(newBookedSeats)}`);
    console.log(`[v0] Result: ${JSON.stringify(updatedBookedSeats)}`);

    await db.runAsync(
      `UPDATE showtimes SET booked_seats = ? WHERE id = ?;`,
      [JSON.stringify(updatedBookedSeats), showtimeId],
    )

    console.log("[v0] ✅ Updated booked_seats for showtime:", showtimeId)
  } catch (err) {
    console.error("[v0] ❌ Lỗi khi cập nhật booked_seats:", err)
    throw err
  }
}
