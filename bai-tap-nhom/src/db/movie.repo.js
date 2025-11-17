// ==============================
// 📁 src/db/movie.repo.js
// Quản lý dữ liệu phim (Movies) trong SQLite (API async mới)
// ==============================

import {
  addMovieToFirebase,
  deleteMovieFromFirebase,
  updateMovieInFirebase,
} from "../cloud/sync-manager";
import { getDB } from "./init";
import { generateFirebaseId } from "./utils"; // Fixed import path from ../utils/firebase-utils to ./utils

// ==============================
// 1️⃣ Thêm phim mới
// ==============================
export async function addMovie(movie, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const id = movie.id || generateFirebaseId();

    const {
      title,
      posterUrl,
      description,
      genre,
      duration,
      language,
      director,
      cast,
      release_date,
      rating,
    } = movie;

    if (!title || !duration)
      throw new Error("❌ Thiếu tiêu đề hoặc thời lượng!");

    await db.runAsync(
      `INSERT INTO movies 
        (id, title, posterUrl, description, genre, duration, language, director, cast, release_date, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        title.trim(),
        posterUrl || "",
        description || "",
        genre || "",
        duration,
        language || "",
        director || "",
        cast || "",
        release_date || "",
        rating || 0,
      ]
    );

    const newMovie = await db.getFirstAsync(
      "SELECT * FROM movies WHERE id = ?;",
      [id]
    );

    if (newMovie) {
      await addMovieToFirebase(newMovie);
    }

    console.log("✅ Thêm phim mới thành công!");
    onSuccess && onSuccess(newMovie?.id);
  } catch (err) {
    console.error("❌ Lỗi khi thêm phim:", err);
    onError && onError(err);
  }
}

// ==============================
// 2️⃣ Lấy danh sách phim (lọc + tìm kiếm)
// ==============================
export async function getMovies(options = {}, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const { search = "", genre = "", sort = "title ASC" } = options;
    let query = `SELECT * FROM movies`;
    const params = [];

    const filters = [];
    if (search) {
      filters.push(`(title LIKE ? OR description LIKE ? OR director LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (genre) {
      filters.push(`genre = ?`);
      params.push(genre);
    }
    if (filters.length > 0) query += " WHERE " + filters.join(" AND ");
    query += ` ORDER BY ${sort};`;

    const rows = await db.getAllAsync(query, params);
    console.log(`🎬 Lấy ${rows.length} phim từ DB`);
    onSuccess && onSuccess(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách phim:", err);
    onError && onError(err);
  }
}

// ==============================
// 3️⃣ Lấy chi tiết phim theo ID
// ==============================
export async function getMovieById(id, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const movie = await db.getFirstAsync("SELECT * FROM movies WHERE id = ?;", [
      id,
    ]);
    if (movie) onSuccess && onSuccess(movie);
    else onError && onError("Không tìm thấy phim.");
  } catch (err) {
    console.error("❌ Lỗi khi lấy phim theo ID:", err);
    onError && onError(err);
  }
}

// ==============================
// 4️⃣ Cập nhật phim
// ==============================
export async function updateMovie(movie, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");
    if (!movie.id) throw new Error("Thiếu ID phim!");

    await db.runAsync(
      `UPDATE movies SET 
        title = ?, posterUrl = ?, description = ?, genre = ?, duration = ?, 
        language = ?, director = ?, cast = ?, release_date = ?, rating = ?
      WHERE id = ?;`,
      [
        movie.title,
        movie.posterUrl || "",
        movie.description || "",
        movie.genre || "",
        movie.duration,
        movie.language || "",
        movie.director || "",
        movie.cast || "",
        movie.release_date || "",
        movie.rating || 0,
        movie.id,
      ]
    );

    await updateMovieInFirebase(movie);

    console.log("✏️ Cập nhật phim thành công!");
    onSuccess && onSuccess();
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật phim:", err);
    onError && onError(err);
  }
}

// ==============================
// 5️⃣ Xóa phim
// ==============================
export async function deleteMovie(id, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const showtimes = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM showtimes WHERE movie_id = ?;",
      [id]
    );
    const showtimeCount = showtimes[0]?.count || 0;

    if (showtimeCount > 0) {
      throw new Error(
        "❌ Không thể xóa phim vì phim này có lịch chiếu. Hãy xóa lịch chiếu trước!"
      );
    }

    const bookings = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       WHERE s.movie_id = ?;`,
      [id]
    );
    const bookingCount = bookings[0]?.count || 0;

    if (bookingCount > 0) {
      throw new Error(
        "❌ Không thể xóa phim vì có người đặt vé cho phim này. Hãy hủy đơn đặt trước!"
      );
    }

    await deleteMovieFromFirebase(id);
    await db.runAsync("DELETE FROM movies WHERE id = ?;", [id]);
    console.log("🗑️ Xóa phim thành công!");
    onSuccess && onSuccess();
  } catch (err) {
    console.error("❌ Lỗi khi xóa phim:", err);
    onError && onError(err);
  }
}

// ==============================
// 6️⃣ Kiểm tra trùng tên phim
// ==============================
export async function checkDuplicateTitle(title, callback) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const rows = await db.getAllAsync(
      `SELECT COUNT(*) as count FROM movies WHERE LOWER(title) = LOWER(?);`,
      [title.trim()]
    );

    const count = rows[0]?.count || 0;
    callback && callback(count > 0);
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra trùng tên:", err);
    callback && callback(false);
  }
}
