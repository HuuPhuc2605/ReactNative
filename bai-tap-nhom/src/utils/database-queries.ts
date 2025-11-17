import { getDB } from "../db/init";

export async function getMovieStats() {
  const db = getDB();
  if (!db) throw new Error("Database chưa sẵn sàng");

  const stats = await db.getFirstAsync(`
    SELECT 
      COUNT(DISTINCT m.id) as total_movies,
      COUNT(DISTINCT s.id) as total_showtimes,
      COUNT(DISTINCT CASE WHEN s.start_time >= datetime('now') THEN s.id END) as upcoming_showtimes
    FROM movies m
    LEFT JOIN showtimes s ON m.id = s.movie_id;
  `);

  return stats;
}

export async function getUserStats() {
  const db = getDB();
  if (!db) throw new Error("Database chưa sẵn sàng");

  const stats = await db.getFirstAsync(`
    SELECT 
      COUNT(DISTINCT user_name) as total_users,
      COUNT(DISTINCT CASE WHEN DATE(created_at) = DATE('now') THEN user_name END) as today_users
    FROM bookings;
  `);

  return stats;
}

export async function getTodayTickets() {
  const db = getDB();
  if (!db) throw new Error("Database chưa sẵn sàng");

  const stats = await db.getFirstAsync(`
    SELECT 
      COUNT(id) as tickets_today,
      SUM(total_price) as revenue_today,
      COUNT(DISTINCT user_name) as customers_today
    FROM bookings
    WHERE DATE(created_at) = DATE('now') AND status IN ('booked', 'paid');
  `);

  return stats;
}

export async function getTopMovies(limit = 5) {
  const db = getDB();
  if (!db) throw new Error("Database chưa sẵn sàng");

  const movies = await db.getAllAsync(
    `
    SELECT 
      m.title,
      COUNT(b.id) as ticket_count,
      SUM(b.total_price) as total_revenue
    FROM bookings b
    JOIN showtimes s ON b.showtime_id = s.id
    JOIN movies m ON s.movie_id = m.id
    WHERE b.status IN ('booked', 'paid')
    GROUP BY m.id
    ORDER BY ticket_count DESC
    LIMIT ?;
  `,
    [limit]
  );

  return movies;
}

export async function getTotalRevenue() {
  const db = getDB();
  if (!db) throw new Error("Database chưa sẵn sàng");

  const stats = await db.getFirstAsync(`
    SELECT 
      SUM(total_price) as total_revenue,
      COUNT(id) as total_tickets
    FROM bookings
    WHERE status IN ('booked', 'paid');
  `);

  return stats;
}

export async function getTheaterStats() {
  const db = getDB();
  if (!db) throw new Error("Database chưa sẵn sàng");

  const stats = await db.getAllAsync(`
    SELECT 
      th.name as theater_name,
      COUNT(DISTINCT sc.id) as screen_count,
      COUNT(DISTINCT s.id) as showtime_count
    FROM theaters th
    LEFT JOIN screens sc ON th.id = sc.theater_id
    LEFT JOIN showtimes s ON sc.id = s.screen_id
    GROUP BY th.id;
  `);

  return stats;
}
