/**
 * 🔄 ENHANCED SYNC MANAGER - Quản lý đồng bộ dữ liệu giữa SQLite Local và Firebase Cloud
 *
 * Quy tắc:
 * - Khi có mạng: Thực hiện CRUD operations đồng thời trên Local và Cloud
 * - Khi offline: Lưu vào queue, thực hiện khi online trở lại
 * - Xử lý lỗi gracefully và log chi tiết
 */

import NetInfo from "@react-native-community/netinfo";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db as dbCloud } from "../db/firebase";
import { getDB } from "../db/init";

// ========================================
// 📊 TRẠNG THÁI MẠNG & QUEUE
// ========================================
let isOnline = true;
const syncQueue = [];

export async function initNetworkListener() {
  try {
    console.log("[v0] 🔄 Initializing network listener...");
    const netState = await NetInfo.fetch();
    isOnline = netState.isConnected || false;
    console.log(
      `[v0] Network state initialized: ${isOnline ? "🌐 ONLINE" : "📴 OFFLINE"}`
    );

    NetInfo.addEventListener((state) => {
      const wasOffline = !isOnline;
      isOnline = state.isConnected || false;

      console.log(
        `[v0] Network state changed: ${isOnline ? "🌐 ONLINE" : "📴 OFFLINE"}`
      );

      if (wasOffline && isOnline) {
        console.log("[v0] Network is back, processing sync queue...");
        processSyncQueue();
      }
    });
  } catch (err) {
    console.error("[v0] ❌ Error initializing network listener:", err);
    // Still export the function, just log the error
    isOnline = true; // Assume online by default
  }
}

export function isNetworkOnline() {
  return isOnline;
}

export function addToSyncQueue(action, type, data = {}) {
  syncQueue.push({
    id: Date.now(),
    action,
    type,
    data,
    timestamp: new Date().toISOString(),
  });

  console.log(
    `[v0] 📦 Thêm vào queue: ${action} (${type}) - Total: ${syncQueue.length}`
  );
}

export function getSyncQueueLength() {
  return syncQueue.length;
}

export async function processSyncQueue() {
  if (syncQueue.length === 0) {
    console.log("[v0] ✅ Hàng đợi đồng bộ trống");
    return;
  }

  console.log(`[v0] ⚙️ Xử lý ${syncQueue.length} hành động trong queue...`);

  while (syncQueue.length > 0) {
    const item = syncQueue.shift();
    console.log(`[v0] ▶️ Xử lý: ${item.action} (${item.type})`);

    try {
      if (item.type === "movie") {
        if (item.action === "add") {
          await addMovieToFirebase(item.data);
        } else if (item.action === "update") {
          await updateMovieInFirebase(item.data);
        } else if (item.action === "delete") {
          await deleteMovieFromFirebase(item.data.id);
        }
      } else if (item.type === "theater") {
        if (item.action === "add") {
          await addTheaterToFirebase(item.data);
        } else if (item.action === "update") {
          await updateTheaterInFirebase(item.data);
        } else if (item.action === "delete") {
          await deleteTheaterFromFirebase(item.data.id);
        }
      } else if (item.type === "screen") {
        if (item.action === "add") {
          await addScreenToFirebase(item.data);
        } else if (item.action === "update") {
          await updateScreenInFirebase(item.data);
        } else if (item.action === "delete") {
          await deleteScreenFromFirebase(item.data.id);
        }
      } else if (item.type === "showtime") {
        if (item.action === "add") {
          await addShowtimeToFirebase(item.data);
        } else if (item.action === "update") {
          await updateShowtimeInFirebase(item.data);
        } else if (item.action === "delete") {
          await deleteShowtimeFromFirebase(item.data.id);
        }
      } else if (item.type === "booking") {
        if (item.action === "add") {
          await addBookingToFirebase(item.data);
        } else if (item.action === "update") {
          await updateBookingInFirebase(item.data);
        } else if (item.action === "delete") {
          await deleteBookingFromFirebase(item.data.id);
        }
      }
    } catch (err) {
      console.error(`[v0] ❌ Lỗi xử lý queue item:`, err);
      // Thêm lại vào queue để thử lại lần sau
      syncQueue.push(item);
    }
  }

  console.log("[v0] ✅ Hàng đợi đã được xử lý");
}

// ========================================
// 📤 MOVIES - THÊM LÊN FIREBASE
// ========================================
export async function addMovieToFirebase(movie) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("add", "movie", movie);
      return;
    }

    const movieRef = doc(dbCloud, "movies", String(movie.id));
    await setDoc(movieRef, {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl || "",
      description: movie.description || "",
      genre: movie.genre || "",
      duration: movie.duration,
      language: movie.language || "",
      director: movie.director || "",
      cast: movie.cast || "",
      release_date: movie.release_date || "",
      rating: movie.rating || 0,
      lastSyncTime: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    console.log(
      `[v0] ☁️ Added movie "${movie.title}" to Firebase (ID: ${movie.id})`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi thêm phim lên Firebase:", err);
    addToSyncQueue("add", "movie", movie);
    throw err;
  }
}

// ========================================
// 🔄 MOVIES - CẬP NHẬT FIREBASE
// ========================================
export async function updateMovieInFirebase(movie) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("update", "movie", movie);
      return;
    }

    const movieRef = doc(dbCloud, "movies", String(movie.id));
    await updateDoc(movieRef, {
      title: movie.title,
      posterUrl: movie.posterUrl || "",
      description: movie.description || "",
      genre: movie.genre || "",
      duration: movie.duration,
      language: movie.language || "",
      director: movie.director || "",
      cast: movie.cast || "",
      release_date: movie.release_date || "",
      rating: movie.rating || 0,
      lastSyncTime: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Updated movie "${movie.title}" in Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi cập nhật phim trên Firebase:", err);
    addToSyncQueue("update", "movie", movie);
    throw err;
  }
}

// ========================================
// 🗑️ MOVIES - XÓA TỪ FIREBASE
// ========================================
export async function deleteMovieFromFirebase(movieId) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("delete", "movie", { id: movieId });
      return;
    }

    const movieRef = doc(dbCloud, "movies", String(movieId));
    await deleteDoc(movieRef);

    console.log(`[v0] ☁️ Deleted movie (ID: ${movieId}) from Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi xóa phim trên Firebase:", err);
    addToSyncQueue("delete", "movie", { id: movieId });
    throw err;
  }
}

// ========================================
// 📤 THEATERS - THÊM LÊN FIREBASE
// ========================================
export async function addTheaterToFirebase(theater) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("add", "theater", theater);
      return;
    }

    const theaterRef = doc(dbCloud, "theaters", String(theater.id));
    await setDoc(theaterRef, {
      id: theater.id,
      name: theater.name,
      location: theater.location || "",
      lastSyncTime: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    console.log(
      `[v0] ☁️ Added theater "${theater.name}" to Firebase (ID: ${theater.id})`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi thêm rạp lên Firebase:", err);
    addToSyncQueue("add", "theater", theater);
    throw err;
  }
}

// ========================================
// 🔄 THEATERS - CẬP NHẬT FIREBASE
// ========================================
export async function updateTheaterInFirebase(theater) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("update", "theater", theater);
      return;
    }

    const theaterRef = doc(dbCloud, "theaters", String(theater.id));
    await updateDoc(theaterRef, {
      name: theater.name,
      location: theater.location || "",
      lastSyncTime: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Updated theater "${theater.name}" in Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi cập nhật rạp trên Firebase:", err);
    addToSyncQueue("update", "theater", theater);
    throw err;
  }
}

// ========================================
// 🗑️ THEATERS - XÓA TỪ FIREBASE
// ========================================
export async function deleteTheaterFromFirebase(theaterId) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("delete", "theater", { id: theaterId });
      return;
    }

    const theaterRef = doc(dbCloud, "theaters", String(theaterId));
    await deleteDoc(theaterRef);

    console.log(`[v0] ☁️ Deleted theater (ID: ${theaterId}) from Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi xóa rạp trên Firebase:", err);
    addToSyncQueue("delete", "theater", { id: theaterId });
    throw err;
  }
}

// ========================================
// 📤 SCREENS - THÊM LÊN FIREBASE
// ========================================
export async function addScreenToFirebase(screen) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("add", "screen", screen);
      return;
    }

    const screenRef = doc(dbCloud, "screens", String(screen.id));
    await setDoc(screenRef, {
      id: screen.id,
      theater_id: screen.theater_id,
      name: screen.name,
      rows: screen.rows,
      cols: screen.cols,
      seat_map:
        typeof screen.seat_map === "string"
          ? screen.seat_map
          : JSON.stringify(screen.seat_map),
      lastSyncTime: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    console.log(
      `[v0] ☁️ Added screen "${screen.name}" to Firebase (ID: ${screen.id})`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi thêm phòng chiếu lên Firebase:", err);
    addToSyncQueue("add", "screen", screen);
    throw err;
  }
}

// ========================================
// 🔄 SCREENS - CẬP NHẬT FIREBASE
// ========================================
export async function updateScreenInFirebase(screen) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("update", "screen", screen);
      return;
    }

    const screenRef = doc(dbCloud, "screens", String(screen.id));
    await updateDoc(screenRef, {
      name: screen.name,
      rows: screen.rows,
      cols: screen.cols,
      seat_map:
        typeof screen.seat_map === "string"
          ? screen.seat_map
          : JSON.stringify(screen.seat_map),
      lastSyncTime: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Updated screen "${screen.name}" in Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi cập nhật phòng chiếu trên Firebase:", err);
    addToSyncQueue("update", "screen", screen);
    throw err;
  }
}

// ========================================
// 🗑️ SCREENS - XÓA TỪ FIREBASE
// ========================================
export async function deleteScreenFromFirebase(screenId) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("delete", "screen", { id: screenId });
      return;
    }

    const screenRef = doc(dbCloud, "screens", String(screenId));
    await deleteDoc(screenRef);

    console.log(`[v0] ☁️ Deleted screen (ID: ${screenId}) from Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi xóa phòng chiếu trên Firebase:", err);
    addToSyncQueue("delete", "screen", { id: screenId });
    throw err;
  }
}

// ========================================
// 📤 SHOWTIMES - THÊM LÊN FIREBASE
// ========================================
export async function addShowtimeToFirebase(showtime) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("add", "showtime", showtime);
      return;
    }

    const showtimeRef = doc(dbCloud, "showtimes", String(showtime.id));
    await setDoc(showtimeRef, {
      id: showtime.id,
      movie_id: showtime.movie_id,
      screen_id: showtime.screen_id,
      start_time: showtime.start_time,
      price: showtime.price,
      status: showtime.status || "active",
      booked_seats:
        typeof showtime.booked_seats === "string"
          ? showtime.booked_seats
          : showtime.booked_seats
          ? JSON.stringify(showtime.booked_seats)
          : "[]",
      movie_title: showtime.movie_title || "",
      theater_name: showtime.theater_name || "",
      screen_name: showtime.screen_name || "",
      lastSyncTime: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Added showtime to Firebase (ID: ${showtime.id})`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi thêm suất chiếu lên Firebase:", err);
    addToSyncQueue("add", "showtime", showtime);
    throw err;
  }
}

// ========================================
// 🔄 SHOWTIMES - CẬP NHẬT FIREBASE
// ========================================
export async function updateShowtimeInFirebase(showtime) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("update", "showtime", showtime);
      return;
    }

    const showtimeRef = doc(dbCloud, "showtimes", String(showtime.id));
    await updateDoc(showtimeRef, {
      movie_id: showtime.movie_id,
      screen_id: showtime.screen_id,
      start_time: showtime.start_time,
      price: showtime.price,
      status: showtime.status || "active",
      booked_seats:
        typeof showtime.booked_seats === "string"
          ? showtime.booked_seats
          : showtime.booked_seats
          ? JSON.stringify(showtime.booked_seats)
          : "[]",
      movie_title: showtime.movie_title || "",
      theater_name: showtime.theater_name || "",
      screen_name: showtime.screen_name || "",
      lastSyncTime: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Updated showtime in Firebase (ID: ${showtime.id})`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi cập nhật suất chiếu trên Firebase:", err);
    addToSyncQueue("update", "showtime", showtime);
    throw err;
  }
}

// ========================================
// 🗑️ SHOWTIMES - XÓA TỪ FIREBASE
// ========================================
export async function deleteShowtimeFromFirebase(showtimeId) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("delete", "showtime", { id: showtimeId });
      return;
    }

    const showtimeRef = doc(dbCloud, "showtimes", String(showtimeId));
    await deleteDoc(showtimeRef);

    console.log(`[v0] ☁️ Deleted showtime (ID: ${showtimeId}) from Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi xóa suất chiếu trên Firebase:", err);
    addToSyncQueue("delete", "showtime", { id: showtimeId });
    throw err;
  }
}

// ========================================
// 📤 BOOKINGS - THÊM LÊN FIREBASE
// ========================================
export async function addBookingToFirebase(booking) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("add", "booking", booking);
      return;
    }

    const bookingRef = doc(dbCloud, "bookings", String(booking.id));
    await setDoc(bookingRef, {
      id: booking.id,
      showtime_id: booking.showtime_id,
      user_name: booking.user_name,
      seats:
        typeof booking.seats === "string"
          ? booking.seats
          : JSON.stringify(booking.seats),
      total_price: booking.total_price,
      status: booking.status || "booked",
      created_at: booking.created_at || new Date().toISOString(),
      lastSyncTime: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Added booking to Firebase (ID: ${booking.id})`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi thêm booking lên Firebase:", err);
    addToSyncQueue("add", "booking", booking);
    throw err;
  }
}

// ========================================
// 🔄 BOOKINGS - CẬP NHẬT FIREBASE
// ========================================
export async function updateBookingInFirebase(booking) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("update", "booking", booking);
      return;
    }

    const bookingRef = doc(dbCloud, "bookings", String(booking.id));
    await updateDoc(bookingRef, {
      status: booking.status || "booked",
      seats:
        typeof booking.seats === "string"
          ? booking.seats
          : JSON.stringify(booking.seats),
      total_price: booking.total_price,
      lastSyncTime: serverTimestamp(),
    });

    console.log(`[v0] ☁️ Updated booking in Firebase (ID: ${booking.id})`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi cập nhật booking trên Firebase:", err);
    addToSyncQueue("update", "booking", booking);
    throw err;
  }
}

// ========================================
// 🗑️ BOOKINGS - XÓA TỪ FIREBASE
// ========================================
export async function deleteBookingFromFirebase(bookingId) {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, lưu vào queue");
      addToSyncQueue("delete", "booking", { id: bookingId });
      return;
    }

    const bookingRef = doc(dbCloud, "bookings", String(bookingId));
    await deleteDoc(bookingRef);

    console.log(`[v0] ☁️ Deleted booking (ID: ${bookingId}) from Firebase`);
  } catch (err) {
    console.error("[v0] ❌ Lỗi xóa booking trên Firebase:", err);
    addToSyncQueue("delete", "booking", { id: bookingId });
    throw err;
  }
}

// ========================================
// 📥 DOWNLOAD DỮ LIỆU TỪ FIREBASE
// ========================================

export async function syncMoviesFromCloud() {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, bỏ qua tải movies từ cloud");
      return;
    }

    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const snapshot = await getDocs(collection(dbCloud, "movies"));

    for (const docSnap of snapshot.docs) {
      const movie = docSnap.data();
      await db.runAsync(
        `INSERT OR REPLACE INTO movies 
        (id, title, posterUrl, description, genre, duration, language, director, cast, release_date, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          movie.id,
          movie.title,
          movie.posterUrl || "",
          movie.description || "",
          movie.genre || "",
          movie.duration || 0,
          movie.language || "",
          movie.director || "",
          movie.cast || "",
          movie.release_date || "",
          movie.rating || 0,
        ]
      );
    }

    console.log(
      `[v0] 📥 Downloaded ${snapshot.docs.length} movies from Firebase`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi tải movies từ cloud:", err);
    throw err;
  }
}

export async function syncTheatersFromCloud() {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, bỏ qua tải theaters từ cloud");
      return;
    }

    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const snapshot = await getDocs(collection(dbCloud, "theaters"));

    for (const docSnap of snapshot.docs) {
      const theater = docSnap.data();
      await db.runAsync(
        `INSERT OR REPLACE INTO theaters (id, name, location)
        VALUES (?, ?, ?);`,
        [theater.id, theater.name, theater.location || ""]
      );
    }

    console.log(
      `[v0] 📥 Downloaded ${snapshot.docs.length} theaters from Firebase`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi tải theaters từ cloud:", err);
    throw err;
  }
}

export async function syncScreensFromCloud() {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, bỏ qua tải screens từ cloud");
      return;
    }

    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    await db.execAsync("PRAGMA foreign_keys = OFF;");

    const snapshot = await getDocs(collection(dbCloud, "screens"));

    for (const docSnap of snapshot.docs) {
      const screen = docSnap.data();
      await db.runAsync(
        `INSERT OR REPLACE INTO screens 
        (id, theater_id, name, rows, cols, seat_map)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          screen.id || docSnap.id,
          screen.theater_id || 0,
          screen.name || "",
          screen.rows || 10,
          screen.cols || 12,
          screen.seat_map || "{}",
        ]
      );
    }

    await db.execAsync("PRAGMA foreign_keys = ON;");

    console.log(
      `[v0] 📥 Downloaded ${snapshot.docs.length} screens from Firebase`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi tải screens từ cloud:", err);
    try {
      const db = getDB();
      if (db) await db.execAsync("PRAGMA foreign_keys = ON;");
    } catch (fkErr) {
      console.error("[v0] ❌ Lỗi bật lại foreign keys:", fkErr);
    }
    throw err;
  }
}

export async function syncShowtimesFromCloud() {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, bỏ qua tải showtimes từ cloud");
      return;
    }

    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    await db.execAsync("PRAGMA foreign_keys = OFF;");

    const snapshot = await getDocs(collection(dbCloud, "showtimes"));

    for (const docSnap of snapshot.docs) {
      const showtime = docSnap.data();

      const movieExists = await db.getFirstAsync(
        "SELECT id FROM movies WHERE id = ?",
        [showtime.movie_id]
      );
      const screenExists = await db.getFirstAsync(
        "SELECT id FROM screens WHERE id = ?",
        [showtime.screen_id]
      );

      if (!movieExists) {
        console.warn(
          `[v0] ⚠️ Suất chiếu ${showtime.id} tham chiếu phim không tồn tại (movie_id: ${showtime.movie_id})`
        );
        continue;
      }

      if (!screenExists) {
        console.warn(
          `[v0] ⚠️ Suất chiếu ${showtime.id} tham chiếu phòng không tồn tại (screen_id: ${showtime.screen_id})`
        );
        continue;
      }

      let bookedSeatsValue = "[]";
      try {
        if (showtime.booked_seats) {
          if (typeof showtime.booked_seats === "string") {
            // If it's already a string, verify it's valid JSON
            const parsed = JSON.parse(showtime.booked_seats);
            bookedSeatsValue = JSON.stringify(parsed);
          } else if (Array.isArray(showtime.booked_seats)) {
            // If it's an array, stringify it
            bookedSeatsValue = JSON.stringify(showtime.booked_seats);
          } else {
            // Otherwise default to empty array
            bookedSeatsValue = "[]";
          }
        }
        console.log(
          `[v0] Syncing showtime ${showtime.id} with booked_seats:`,
          bookedSeatsValue
        );
      } catch (e) {
        console.error(
          `[v0] Error parsing booked_seats for showtime ${showtime.id}:`,
          e
        );
        bookedSeatsValue = "[]";
      }

      await db.runAsync(
        `INSERT OR REPLACE INTO showtimes 
        (id, movie_id, screen_id, start_time, price, status, booked_seats)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          showtime.id || docSnap.id,
          showtime.movie_id || 0,
          showtime.screen_id || 0,
          showtime.start_time || "",
          showtime.price || 0,
          showtime.status || "active",
          bookedSeatsValue,
        ]
      );
    }

    await db.execAsync("PRAGMA foreign_keys = ON;");

    console.log(
      `[v0] 📥 Downloaded ${snapshot.docs.length} showtimes from Firebase (with booked_seats)`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi tải showtimes từ cloud:", err);
    try {
      const db = getDB();
      if (db) await db.execAsync("PRAGMA foreign_keys = ON;");
    } catch (fkErr) {
      console.error("[v0] ❌ Lỗi bật lại foreign keys:", fkErr);
    }
    throw err;
  }
}

export async function syncBookingsFromCloud() {
  try {
    if (!isOnline) {
      console.warn("[v0] Offline, bỏ qua tải bookings từ cloud");
      return;
    }

    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    await db.execAsync("PRAGMA foreign_keys = OFF;");

    const snapshot = await getDocs(collection(dbCloud, "bookings"));

    let successCount = 0;
    let errorCount = 0;

    for (const docSnap of snapshot.docs) {
      const booking = docSnap.data();

      const showtimeExists = await db.getFirstAsync(
        "SELECT id FROM showtimes WHERE id = ?",
        [booking.showtime_id]
      );

      if (!showtimeExists) {
        console.warn(
          `[v0] ⚠️ Booking ${booking.id} tham chiếu suất chiếu không tồn tại (showtime_id: ${booking.showtime_id})`
        );
        continue;
      }

      const userName =
        booking.user_name && booking.user_name.trim() !== ""
          ? booking.user_name
          : "customer";

      if (!userName || userName.trim() === "") {
        console.error(
          `[v0] ❌ Booking ${booking.id} has invalid user_name, skipping`
        );
        continue;
      }

      try {
        await db.runAsync(
          `INSERT OR REPLACE INTO bookings 
          (id, showtime_id, user_name, seats, total_price, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            booking.id || docSnap.id,
            booking.showtime_id || 0,
            userName,
            typeof booking.seats === "string"
              ? booking.seats
              : JSON.stringify(booking.seats),
            booking.total_price || 0,
            booking.status || "booked",
            booking.created_at || new Date().toISOString(),
          ]
        );
        console.log(
          `[v0] ✅ Inserted booking ${
            booking.id || docSnap.id
          } with user_name: ${userName}`
        );
        successCount++;
      } catch (insertErr) {
        console.error(
          `[v0] ❌ Lỗi insert booking ${booking.id}:`,
          insertErr.message
        );
        errorCount++;
      }
    }

    await db.execAsync("PRAGMA foreign_keys = ON;");

    console.log(
      `[v0] 📥 Downloaded ${successCount}/${snapshot.docs.length} bookings from Firebase (${errorCount} errors)`
    );
  } catch (err) {
    console.error("[v0] ❌ Lỗi tải bookings từ cloud:", err);
    try {
      const db = getDB();
      if (db) await db.execAsync("PRAGMA foreign_keys = ON;");
    } catch (fkErr) {
      console.error("[v0] ❌ Lỗi bật lại foreign keys:", fkErr);
    }
    throw err;
  }
}

// ========================================
// 🎯 ĐỒNG BỘ TOÀN BỘ
// ========================================

export async function syncAllData() {
  try {
    console.log("[v0] 🔄 Bắt đầu đồng bộ toàn bộ dữ liệu...");

    if (!isOnline) {
      console.log("[v0] 📴 Offline mode: chỉ dùng dữ liệu local");
      return;
    }

    console.log("[v0] Step 1: Tải dữ liệu phim từ Firebase...");
    await syncMoviesFromCloud();

    console.log("[v0] Step 2: Tải theaters từ Firebase...");
    await syncTheatersFromCloud();

    console.log("[v0] Step 3: Tải screens từ Firebase...");
    await syncScreensFromCloud();

    console.log("[v0] Step 4: Tải showtimes từ Firebase...");
    await syncShowtimesFromCloud();

    console.log("[v0] Step 5: Tải bookings từ Firebase...");
    await syncBookingsFromCloud();

    console.log("[v0] ✅ Đồng bộ hoàn tất!");
  } catch (err) {
    console.error("[v0] ❌ Lỗi đồng bộ dữ liệu:", err);
    throw err;
  }
}

// ========================================
// 🛑 KIỂM TRA KẾT NỐI
// ========================================

export function canBookingOffline() {
  if (!isOnline) {
    console.warn(
      "[v0] ❌ Không thể đặt vé khi offline. Hãy kiểm tra kết nối mạng!"
    );
    return false;
  }
  return true;
}
