// // ==============================
// // 📁 src/db/sample-data.js
// // Dữ liệu mẫu cho Showtimes với booked_seats
// // ==============================

// import { getDB } from "./init"
// import { generateFirebaseId } from "./utils"

// /**
//  * 🎬 Tạo dữ liệu mẫu showtimes
//  * Gồm: Phim mẫu, Phòng chiếu, và Suất chiếu với danh sách ghế đã đặt
//  */
// export async function seedSampleShowtimes() {
//   try {
//     const db = getDB()
//     if (!db) throw new Error("Database chưa sẵn sàng")

//     console.log("🌱 Bắt đầu tạo dữ liệu mẫu...")

//     // 1️⃣ Tạo Theater mẫu
//     const theaterId = generateFirebaseId()
//     await db.runAsync(
//       `INSERT INTO theaters (id, name, location) VALUES (?, ?, ?);`,
//       [theaterId, "CGV - Hà Nội", "Tầng 5, Vincom Center, Hà Nội"],
//     )
//     console.log("✅ Tạo theater mẫu")

//     // 2️⃣ Tạo Screen mẫu (8 hàng x 10 cột)
//     const screenId = generateFirebaseId()
//     const seatMap = JSON.stringify(
//       Array(8)
//         .fill(null)
//         .map(() => Array(10).fill(0)),
//     )
//     await db.runAsync(
//       `INSERT INTO screens (id, theater_id, name, rows, cols, seat_map) VALUES (?, ?, ?, ?, ?, ?);`,
//       [screenId, theaterId, "Phòng 1 (4DX)", 8, 10, seatMap],
//     )
//     console.log("✅ Tạo screen mẫu")

//     // 3️⃣ Tạo Movies mẫu
//     const movie1Id = generateFirebaseId()
//     const movie2Id = generateFirebaseId()
//     const movie3Id = generateFirebaseId()

//     const movies = [
//       {
//         id: movie1Id,
//         title: "Đảo Kiếm Phù Hợp",
//         posterUrl: "https://via.placeholder.com/300x450?text=One+Piece",
//         description: "Chuyến phiêu lưu của Luffy và đoàn tàu Hải tặc Mũ Rơm",
//         genre: "Adventure, Action",
//         duration: 120,
//         language: "Japanese",
//         director: "Oda Eiichiro",
//         cast: "Luffy, Zoro, Nami",
//         release_date: "2024-01-15",
//         rating: 9.2,
//       },
//       {
//         id: movie2Id,
//         title: "Inception",
//         posterUrl: "https://via.placeholder.com/300x450?text=Inception",
//         description: "Một kỵ sĩ thực hiện vụ trộm trong các giấc mơ",
//         genre: "Sci-Fi, Thriller",
//         duration: 148,
//         language: "English",
//         director: "Christopher Nolan",
//         cast: "Leonardo DiCaprio, Ellen Page",
//         release_date: "2024-02-01",
//         rating: 8.8,
//       },
//       {
//         id: movie3Id,
//         title: "Interstellar",
//         posterUrl: "https://via.placeholder.com/300x450?text=Interstellar",
//         description: "Cuộc hành trình xuyên thiên hà tìm kiếm một hành tinh mới",
//         genre: "Sci-Fi, Drama",
//         duration: 169,
//         language: "English",
//         director: "Christopher Nolan",
//         cast: "Matthew McConaughey, Anne Hathaway",
//         release_date: "2024-02-10",
//         rating: 8.6,
//       },
//     ]

//     for (const movie of movies) {
//       await db.runAsync(
//         `INSERT INTO movies 
//           (id, title, posterUrl, description, genre, duration, language, director, cast, release_date, rating)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
//         [
//           movie.id,
//           movie.title,
//           movie.posterUrl,
//           movie.description,
//           movie.genre,
//           movie.duration,
//           movie.language,
//           movie.director,
//           movie.cast,
//           movie.release_date,
//           movie.rating,
//         ],
//       )
//     }
//     console.log("✅ Tạo 3 phim mẫu")

//     // 4️⃣ Tạo Showtimes mẫu với booked_seats
//     const showtimes = [
//       {
//         id: generateFirebaseId(),
//         movie_id: movie1Id,
//         screen_id: screenId,
//         start_time: "2024-12-15T10:00:00",
//         price: 150000,
//         booked_seats: JSON.stringify(["A1", "A2", "B3", "B4", "C5"]), // 5 ghế đã đặt
//       },
//       {
//         id: generateFirebaseId(),
//         movie_id: movie1Id,
//         screen_id: screenId,
//         start_time: "2024-12-15T14:00:00",
//         price: 150000,
//         booked_seats: JSON.stringify(["A1", "A2", "A3", "A4", "B1", "B2"]), // 6 ghế đã đặt
//       },
//       {
//         id: generateFirebaseId(),
//         movie_id: movie1Id,
//         screen_id: screenId,
//         start_time: "2024-12-15T19:00:00",
//         price: 180000,
//         booked_seats: JSON.stringify(["C1", "C2", "C3", "D1", "D2", "D3", "D4"]), // 7 ghế đã đặt
//       },
//       {
//         id: generateFirebaseId(),
//         movie_id: movie2Id,
//         screen_id: screenId,
//         start_time: "2024-12-16T10:00:00",
//         price: 150000,
//         booked_seats: JSON.stringify([]), // Không có ghế đã đặt
//       },
//       {
//         id: generateFirebaseId(),
//         movie_id: movie2Id,
//         screen_id: screenId,
//         start_time: "2024-12-16T14:30:00",
//         price: 150000,
//         booked_seats: JSON.stringify(["A5", "A6", "B5", "B6", "C6"]), // 5 ghế đã đặt
//       },
//       {
//         id: generateFirebaseId(),
//         movie_id: movie3Id,
//         screen_id: screenId,
//         start_time: "2024-12-17T18:00:00",
//         price: 180000,
//         booked_seats: JSON.stringify([
//           "A1",
//           "A2",
//           "A3",
//           "A4",
//           "A5",
//           "B1",
//           "B2",
//           "B3",
//         ]), // 8 ghế đã đặt
//       },
//     ]

//     for (const showtime of showtimes) {
//       await db.runAsync(
//         `INSERT INTO showtimes (id, movie_id, screen_id, start_time, price, status, booked_seats) 
//          VALUES (?, ?, ?, ?, ?, ?, ?);`,
//         [
//           showtime.id,
//           showtime.movie_id,
//           showtime.screen_id,
//           showtime.start_time,
//           showtime.price,
//           "active",
//           showtime.booked_seats,
//         ],
//       )
//     }
//     console.log("✅ Tạo 6 suất chiếu mẫu với booked_seats")

//     // 5️⃣ Tạo Bookings mẫu
//     const bookings = [
//       {
//         id: generateFirebaseId(),
//         showtime_id: showtimes[0].id,
//         user_name: "Nguyễn Văn A",
//         seats: JSON.stringify(["A1", "A2"]),
//         total_price: 300000,
//         created_at: new Date().toISOString(),
//         status: "booked",
//       },
//       {
//         id: generateFirebaseId(),
//         showtime_id: showtimes[0].id,
//         user_name: "Trần Thị B",
//         seats: JSON.stringify(["B3", "B4", "C5"]),
//         total_price: 450000,
//         created_at: new Date().toISOString(),
//         status: "booked",
//       },
//       {
//         id: generateFirebaseId(),
//         showtime_id: showtimes[2].id,
//         user_name: "Lê Văn C",
//         seats: JSON.stringify(["C1", "C2", "C3", "D1", "D2", "D3", "D4"]),
//         total_price: 1260000,
//         created_at: new Date().toISOString(),
//         status: "booked",
//       },
//     ]

//     for (const booking of bookings) {
//       await db.runAsync(
//         `INSERT INTO bookings (id, showtime_id, user_name, seats, total_price, created_at, status) 
//          VALUES (?, ?, ?, ?, ?, ?, ?);`,
//         [
//           booking.id,
//           booking.showtime_id,
//           booking.user_name,
//           booking.seats,
//           booking.total_price,
//           booking.created_at,
//           booking.status,
//         ],
//       )
//     }
//     console.log("✅ Tạo 3 booking mẫu")

//     console.log("🎉 Hoàn thành tạo dữ liệu mẫu!")
//     return {
//       theaterId,
//       screenId,
//       movieIds: [movie1Id, movie2Id, movie3Id],
//       showtimeIds: showtimes.map((s) => s.id),
//     }
//   } catch (err) {
//     console.error("❌ Lỗi khi tạo dữ liệu mẫu:", err)
//     throw err
//   }
// }

// /**
//  * 🧹 Xóa tất cả dữ liệu mẫu (nếu cần reset)
//  */
// export async function clearSampleData() {
//   try {
//     const db = getDB()
//     if (!db) throw new Error("Database chưa sẵn sàng")

//     console.log("🧹 Xóa dữ liệu...")
//     await db.runAsync("DELETE FROM bookings;")
//     await db.runAsync("DELETE FROM showtimes;")
//     await db.runAsync("DELETE FROM screens;")
//     await db.runAsync("DELETE FROM theaters;")
//     await db.runAsync("DELETE FROM movies;")
//     console.log("✅ Xóa dữ liệu thành công!")
//   } catch (err) {
//     console.error("❌ Lỗi khi xóa dữ liệu:", err)
//     throw err
//   }
// }
