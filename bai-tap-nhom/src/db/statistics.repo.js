// ==============================
// 📁 src/db/statistics.repo.js
// Quản lý dữ liệu thống kê (Statistics) từ SQLite
// Dành cho Admin - báo cáo doanh thu, bán vé
// ==============================

import { getDB } from "./init";

// ==============================
// 1️⃣ Thống kê doanh thu theo ngày
// ==============================
export async function getRevenueByDay(onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const revenue = await db.getAllAsync(
      `SELECT 
        DATE(b.created_at) as date,
        COUNT(b.id) as ticket_count,
        SUM(b.total_price) as total_revenue
      FROM bookings b
      WHERE b.status IN ('booked', 'paid')
      GROUP BY DATE(b.created_at)
      ORDER BY date DESC
      LIMIT 30;`
    );

    console.log(`📊 Lấy ${revenue.length} ngày thống kê doanh thu`);
    onSuccess && onSuccess(revenue);
  } catch (err) {
    console.error("❌ Lỗi khi lấy doanh thu theo ngày:", err);
    onError && onError(err);
  }
}

// ==============================
// 2️⃣ Thống kê doanh thu theo phim
// ==============================
export async function getRevenueByMovie(onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const revenue = await db.getAllAsync(
      `SELECT 
        m.id as movie_id,
        m.title as movie_title,
        COUNT(b.id) as ticket_count,
        SUM(b.total_price) as total_revenue,
        COUNT(DISTINCT b.showtime_id) as showtime_count
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      WHERE b.status IN ('booked', 'paid')
      GROUP BY m.id
      ORDER BY total_revenue DESC;`
    );

    console.log(`📊 Lấy ${revenue.length} phim thống kê doanh thu`);
    onSuccess && onSuccess(revenue);
  } catch (err) {
    console.error("❌ Lỗi khi lấy doanh thu theo phim:", err);
    onError && onError(err);
  }
}

// ==============================
// 3️⃣ Thống kê số vé bán
// ==============================
export async function getTicketsSold(onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const stats = await db.getFirstAsync(
      `SELECT 
        COUNT(b.id) as total_tickets,
        COUNT(DISTINCT b.user_name) as total_customers,
        COUNT(DISTINCT b.showtime_id) as total_showtimes,
        SUM(b.total_price) as total_revenue
      FROM bookings b
      WHERE b.status IN ('booked', 'paid');`
    );

    console.log(`📊 Lấy thống kê vé bán`);
    onSuccess && onSuccess(stats);
  } catch (err) {
    console.error("❌ Lỗi khi lấy thống kê vé:", err);
    onError && onError(err);
  }
}

// ==============================
// 4️⃣ Thống kê chi tiết theo ngày
// ==============================
export async function getDetailedStats(dateString, onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    const details = await db.getAllAsync(
      `SELECT 
        m.title as movie_title,
        th.name as theater_name,
        sc.name as screen_name,
        s.start_time,
        COUNT(b.id) as ticket_count,
        SUM(b.total_price) as revenue
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN theaters th ON sc.theater_id = th.id
      WHERE b.status IN ('booked', 'paid')
        AND DATE(b.created_at) = ?
      GROUP BY s.id
      ORDER BY s.start_time DESC;`,
      [dateString]
    );

    console.log(
      `📊 Lấy ${details.length} chi tiết thống kê cho ngày ${dateString}`
    );
    onSuccess && onSuccess(details);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết thống kê:", err);
    onError && onError(err);
  }
}

// ==============================
// 5️⃣ Lấy dữ liệu thống kê tổng hợp
// ==============================
export async function getSummaryStats(onSuccess, onError) {
  try {
    const db = getDB();
    if (!db) throw new Error("Database chưa sẵn sàng");

    // Tổng doanh thu hôm nay
    const todayRevenue = await db.getFirstAsync(
      `SELECT 
        COUNT(b.id) as today_tickets,
        SUM(b.total_price) as today_revenue
      FROM bookings b
      WHERE b.status IN ('booked', 'paid')
        AND DATE(b.created_at) = DATE('now');`
    );

    // Tổng doanh thu toàn bộ
    const totalStats = await db.getFirstAsync(
      `SELECT 
        COUNT(b.id) as total_tickets,
        COUNT(DISTINCT b.user_name) as total_customers,
        SUM(b.total_price) as total_revenue
      FROM bookings b
      WHERE b.status IN ('booked', 'paid');`
    );

    // Phim bán chạy nhất
    const topMovie = await db.getFirstAsync(
      `SELECT 
        m.id,
        m.title,
        COUNT(b.id) as ticket_count,
        SUM(b.total_price) as revenue
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      WHERE b.status IN ('booked', 'paid')
      GROUP BY m.id
      ORDER BY ticket_count DESC
      LIMIT 1;`
    );

    const summary = {
      ...todayRevenue,
      ...totalStats,
      topMovie,
    };

    console.log(`📊 Lấy dữ liệu thống kê tổng hợp`);
    onSuccess && onSuccess(summary);
  } catch (err) {
    console.error("❌ Lỗi khi lấy dữ liệu thống kê tổng hợp:", err);
    onError && onError(err);
  }
}
