// ==============================
// 📁 src/db/init.js
// Khởi tạo cơ sở dữ liệu SQLite cho Rn Cinema Management App
// ==============================

import * as FileSystem from "expo-file-system/legacy"
import * as SQLite from "expo-sqlite"

let db // ✅ Biến toàn cục

export async function initDatabase() {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/cinema.db`
    const dbExists = await FileSystem.getInfoAsync(dbPath)

    if (dbExists.exists) {
      console.log("🧹 Xóa database cũ để cập nhật cấu trúc...")
      await FileSystem.deleteAsync(dbPath, { idempotent: true })
    }

    console.log("🛠️ Đang khởi tạo cơ sở dữ liệu mới...")
    db = await SQLite.openDatabaseAsync("cinema.db")

    await db.execAsync(`
      PRAGMA foreign_keys = OFF;

      CREATE TABLE IF NOT EXISTS movies (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        posterUrl TEXT,
        description TEXT,
        genre TEXT,
        duration INTEGER,
        language TEXT,
        director TEXT,
        cast TEXT,
        release_date TEXT,
        rating REAL
      );

      CREATE TABLE IF NOT EXISTS theaters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT
      );

      CREATE TABLE IF NOT EXISTS screens (
        id TEXT PRIMARY KEY,
        theater_id TEXT,
        name TEXT,
        rows INTEGER,
        cols INTEGER,
        seat_map TEXT,
        FOREIGN KEY (theater_id) REFERENCES theaters (id)
      );

      CREATE TABLE IF NOT EXISTS showtimes (
        id TEXT PRIMARY KEY,
        movie_id TEXT,
        screen_id TEXT,
        start_time TEXT,
        price REAL,
        status TEXT DEFAULT 'active',
        booked_seats TEXT DEFAULT '[]',
        FOREIGN KEY (movie_id) REFERENCES movies (id),
        FOREIGN KEY (screen_id) REFERENCES screens (id)
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        showtime_id TEXT,
        user_name TEXT NOT NULL,
        seats TEXT,
        total_price REAL,
        created_at TEXT,
        status TEXT DEFAULT 'booked',
        FOREIGN KEY (showtime_id) REFERENCES showtimes (id)
      );

      PRAGMA foreign_keys = ON;
    `)

    console.log("✅ Các bảng đã được tạo thành công.")
    return db
  } catch (err) {
    console.error("❌ Lỗi khởi tạo DB:", err)
  }
}

export async function checkDatabaseReady() {
  if (!db) return false
  const tables = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table';")
  console.log(
    "📋 Các bảng trong DB:",
    tables.map((t) => t.name),
  )
  return true
}

export function getDB() {
  if (!db) {
    console.warn("⚠️ Database chưa được khởi tạo. Hãy gọi initDatabase() trước!")
  }
  return db
}
