import NetInfo from "@react-native-community/netinfo"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { db as dbCloud } from "../db/firebase"
import { getDB } from "../db/init"

/** 🔄 Đồng bộ booking của user cụ thể từ Firestore về local - using EMAIL */
export async function syncUserBookingsFromCloud(email) {
  const db = getDB()

  if (!db) {
    console.error("[v0] ❌ SQLite DB chưa khởi tạo")
    return false
  }

  if (!dbCloud) {
    console.error("[v0] ❌ Firebase DB chưa khởi tạo")
    return false
  }

  try {
    const validatedEmail = email && email.trim() !== "" ? email : "customer"
    console.log("[v0] 🔄 Bắt đầu query Firebase bookings với email:", validatedEmail)

    if (!validatedEmail || validatedEmail.trim() === "") {
      console.error("[v0] ❌ Email không hợp lệ:", email)
      return false
    }

    const existingCustomerBookings = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM bookings WHERE user_name = 'customer'`,
    )

    if (existingCustomerBookings[0]?.count > 0 && email !== "customer") {
      console.log(
        `[v0] 🔧 Tìm thấy ${existingCustomerBookings[0].count} booking cũ (user_name='customer'), đang migrate...`,
      )
      await migrateOldBookingsToUserEmail("customer", email)
    }

    const q = query(collection(dbCloud, "bookings"), where("user_name", "==", validatedEmail))
    const snapshot = await getDocs(q)

    console.log(`[v0] 📥 Tìm thấy ${snapshot.docs.length} booking của ${validatedEmail}`)

    if (snapshot.docs.length === 0) {
      console.log(`[v0] ℹ️ Không có booking nào cho ${validatedEmail}`)
      return true
    }

    const bookingsBefore = await db.getAllAsync(`SELECT COUNT(*) as count FROM bookings`)
    console.log(`[v0] 📊 Tổng booking trước xóa: ${bookingsBefore[0]?.count || 0}`)

    const userBookingsBefore = await db.getAllAsync(`SELECT COUNT(*) as count FROM bookings WHERE user_name = ?`, [
      validatedEmail,
    ])
    console.log(`[v0] 📊 Booking của ${validatedEmail} trước xóa: ${userBookingsBefore[0]?.count || 0}`)

    await db.runAsync("PRAGMA foreign_keys = OFF")

    console.log(`[v0] 🗑️ Xóa toàn bộ dữ liệu trong bảng bookings (trước khi sync mới)...`)
    const deleteResult = await db.runAsync(`DELETE FROM bookings`)
    console.log(`[v0] ✅ Đã xóa ${deleteResult.changes} bản ghi khỏi bảng bookings`)

    const bookingsAfterDelete = await db.getAllAsync(`SELECT COUNT(*) as count FROM bookings`)
    console.log(`[v0] 📊 Tổng booking sau xóa: ${bookingsAfterDelete[0]?.count || 0}`)

    let successCount = 0
    let errorCount = 0

    for (const docSnap of snapshot.docs) {
      const booking = docSnap.data()
      console.log("[v0] 📄 Doc:", JSON.stringify(booking))

      try {
        let seatsData = JSON.stringify([])
        if (booking.seats) {
          if (Array.isArray(booking.seats)) {
            seatsData = JSON.stringify(booking.seats)
          } else if (typeof booking.seats === "string") {
            try {
              const parsed = JSON.parse(booking.seats)
              seatsData = JSON.stringify(parsed)
            } catch {
              seatsData = JSON.stringify([booking.seats])
            }
          }
        }

        const createdAt = booking.created_at || new Date().toISOString()
        const bookingId = booking.id || docSnap.id

        const finalUserName = booking.user_name && booking.user_name.trim() !== "" ? booking.user_name : validatedEmail
        console.log(
          `[v0] 💾 Inserting: id=${bookingId}, showtime_id=${booking.showtime_id}, user_name=${finalUserName}`,
        )

        await db.runAsync(
          `INSERT INTO bookings (id, showtime_id, user_name, seats, total_price, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            bookingId,
            booking.showtime_id,
            finalUserName,
            seatsData,
            booking.total_price || 0,
            createdAt,
            booking.status || "booked",
          ],
        )

        console.log(`[v0] ✅ Inserted booking ${bookingId}`)
        successCount++
      } catch (insertErr) {
        console.error(`[v0] ❌ Lỗi insert booking ${booking.id}:`, insertErr.message)
        errorCount++
      }
    }

    await db.runAsync("PRAGMA foreign_keys = ON")

    const totalFinal = await db.getAllAsync(`SELECT COUNT(*) as count FROM bookings`)
    console.log(`[v0] 📊 Tổng booking sau sync: ${totalFinal[0]?.count || 0}`)

    const verifyResults = await db.getAllAsync(`SELECT id, user_name FROM bookings WHERE user_name = ?`, [
      validatedEmail,
    ])
    console.log(
      `[v0] ✅ Verified ${verifyResults.length}/${snapshot.docs.length} bookings synced for ${validatedEmail}`,
    )
    verifyResults.forEach((b) => console.log(`[v0] 📊 Booking in DB: id=${b.id}, user_name=${b.user_name}`))

    console.log(
      `[v0] ✅ Đã đồng bộ ${successCount}/${snapshot.docs.length} booking (${errorCount} lỗi) của ${validatedEmail}`,
    )
    return successCount > 0
  } catch (err) {
    console.error("[v0] ❌ Lỗi sync từ cloud:", err.message)
    console.error("[v0] Stack:", err.stack)

    try {
      const db2 = getDB()
      if (db2) await db2.runAsync("PRAGMA foreign_keys = ON")
    } catch (fkErr) {
      console.error("[v0] ❌ Lỗi bật lại foreign keys:", fkErr)
    }
    return false
  }
}

/** 📤 Đồng bộ booking mới từ local lên Firestore - using EMAIL */
export async function syncUserBookingsToCloud(email) {
  const db = getDB()

  if (!db || !dbCloud) {
    console.warn("[v0] ⚠️ DB chưa sẵn sàng")
    return false
  }

  try {
    const bookings = await db.getAllAsync(`SELECT * FROM bookings WHERE user_name = ?`, [email])

    console.log(`[v0] 📤 Lấy ${bookings.length} booking từ DB cho ${email}`)

    if (bookings.length === 0) {
      console.log(`[v0] ℹ️ Không có booking nào cần upload cho ${email}`)
      return true
    }

    let uploadCount = 0
    for (const booking of bookings) {
      try {
        const seatsArray = typeof booking.seats === "string" ? JSON.parse(booking.seats) : booking.seats

        const bookingDoc = {
          id: booking.id,
          showtime_id: booking.showtime_id,
          user_name: email,
          seats: seatsArray,
          total_price: booking.total_price,
          created_at: booking.created_at,
          status: booking.status,
        }

        console.log(`[v0] ☁️ Uploading booking ${booking.id}: ${JSON.stringify(bookingDoc)}`)

        await setDoc(doc(dbCloud, "bookings", String(booking.id)), bookingDoc, { merge: true })

        console.log(`[v0] ✅ Booking ${booking.id} uploaded`)
        uploadCount++
      } catch (docErr) {
        console.error(`[v0] ❌ Lỗi upload booking ${booking.id}:`, docErr.message)
      }
    }

    console.log(`[v0] ☁️ Đã upload ${uploadCount}/${bookings.length} booking của ${email} lên Firestore`)
    return uploadCount > 0
  } catch (err) {
    console.error("[v0] ❌ Lỗi sync lên cloud:", err.message)
    console.error("[v0] Stack:", err.stack)
    return false
  }
}

/** 🔍 DEBUG: Check what's in Firebase */
export async function debugCheckFirebaseBookings(email) {
  if (!dbCloud) {
    console.error("[v0] ❌ Firebase DB chưa khởi tạo")
    return
  }

  try {
    const q = query(collection(dbCloud, "bookings"), where("user_name", "==", email))
    const snapshot = await getDocs(q)

    console.log(`[v0] 🔍 Firebase bookings cho ${email}: ${snapshot.docs.length} docs`)
    snapshot.docs.forEach((doc) => {
      console.log(`[v0] 📄 Doc: ${JSON.stringify(doc.data())}`)
    })
  } catch (err) {
    console.error("[v0] ❌ Lỗi debug Firebase:", err)
  }
}

/** 🧠 Hàm tổng hợp: đồng bộ cho user cụ thể - using EMAIL */
export async function syncAllForUser(email) {
  console.log("[v0] 🚀 syncAllForUser được gọi với email:", email)

  if (!email) {
    console.error("[v0] ❌ email không hợp lệ")
    return
  }

  let net
  try {
    net = await Promise.race([
      NetInfo.fetch(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000)),
    ])
  } catch (err) {
    console.warn("[v0] ⚠️ Không thể kiểm tra mạng:", err.message)
    net = { isConnected: false }
  }

  if (net.isConnected) {
    console.log(`[v0] 🌐 Có mạng, đang đồng bộ booking của ${email}...`)

    const syncFrom = await syncUserBookingsFromCloud(email)
    console.log(`[v0] Download result: ${syncFrom}`)

    await debugCheckFirebaseBookings(email)

    if (syncFrom) {
      console.log(`[v0] ✅ Đồng bộ hoàn tất cho ${email}`)
    } else {
      console.warn(`[v0] ⚠️ Đồng bộ có lỗi`)
    }
  } else {
    console.log("[v0] 📴 Offline mode - dùng dữ liệu SQLite local")
  }
}

/** 🔍 DEBUG: Lấy danh sách user_name duy nhất trong bookings để kiểm tra */
export async function getBookingUserNames() {
  const db = getDB()
  if (!db) {
    console.error("[v0] ❌ SQLite DB chưa khởi tạo")
    return []
  }

  try {
    const results = await db.getAllAsync(`SELECT DISTINCT user_name FROM bookings`)
    console.log(
      "[v0] 📊 User names trong bookings table:",
      results.map((r) => r.user_name),
    )
    return results
  } catch (err) {
    console.error("[v0] ❌ Lỗi lấy user_name:", err)
    return []
  }
}

/** 🔧 FIX: Cập nhật booking cũ (user_name='customer') thành email của user hiện tại */
export async function migrateOldBookingsToUserEmail(oldUserName, newUserEmail) {
  const db = getDB()
  if (!db) {
    console.error("[v0] ❌ SQLite DB chưa khởi tạo")
    return false
  }

  try {
    console.log(`[v0] 🔄 Migrating bookings từ '${oldUserName}' sang '${newUserEmail}'...`)

    const result = await db.runAsync(`UPDATE bookings SET user_name = ? WHERE user_name = ?`, [
      newUserEmail,
      oldUserName,
    ])

    console.log(`[v0] ✅ Migrated bookings thành công`)
    return true
  } catch (err) {
    console.error("[v0] ❌ Lỗi migrate bookings:", err)
    return false
  }
}
