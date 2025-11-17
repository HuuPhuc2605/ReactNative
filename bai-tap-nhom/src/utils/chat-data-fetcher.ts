import { db as dbFirebase } from "@/src/db/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Fetch analytics data from Firebase for chatbot context
 * This helper module retrieves real cinema management data
 */

interface CinemaStats {
  totalMovies: number;
  totalTheaters: number;
  totalBookings: number;
  totalRevenue: number;
  topMovie?: string;
  bookedSeatsCount?: number;
}

/**
 * Get all statistics from Firebase collections
 */
export async function getCinemaStats(): Promise<CinemaStats> {
  try {
    const moviesSnapshot = await getDocs(collection(dbFirebase, "movies"));
    const theatersSnapshot = await getDocs(collection(dbFirebase, "theaters"));
    const bookingsSnapshot = await getDocs(collection(dbFirebase, "bookings"));
    const showtimesSnapshot = await getDocs(
      collection(dbFirebase, "showtimes")
    );

    const bookings = bookingsSnapshot.docs.map((doc) => doc.data());
    const totalRevenue = bookings.reduce(
      (sum: number, booking: any) => sum + (booking.total_price || 0),
      0
    );

    const showtimes = showtimesSnapshot.docs.map((doc) => doc.data());
    const bookedSeatsCount = showtimes.reduce((sum: number, showtime: any) => {
      const booked = Array.isArray(showtime.booked_seats)
        ? showtime.booked_seats.length
        : 0;
      return sum + booked;
    }, 0);

    // Find top movie by booking count
    const movieBookingCounts: { [key: string]: number } = {};
    bookings.forEach((booking: any) => {
      const showtimeId = booking.showtime_id;
      const showtime = showtimes.find((s: any) => s.id === showtimeId);
      if (showtime?.movie_title) {
        movieBookingCounts[showtime.movie_title] =
          (movieBookingCounts[showtime.movie_title] || 0) + 1;
      }
    });

    const topMovie = Object.entries(movieBookingCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return {
      totalMovies: moviesSnapshot.docs.length,
      totalTheaters: theatersSnapshot.docs.length,
      totalBookings: bookingsSnapshot.docs.length,
      totalRevenue: Math.round(totalRevenue),
      topMovie: topMovie || "Unknown",
      bookedSeatsCount,
    };
  } catch (error) {
    console.error("[v0] Error fetching cinema stats:", error);
    return {
      totalMovies: 0,
      totalTheaters: 0,
      totalBookings: 0,
      totalRevenue: 0,
    };
  }
}

/**
 * Get summary of recent bookings
 */
export async function getRecentBookings(limit: number = 5): Promise<string> {
  try {
    const bookingsSnapshot = await getDocs(collection(dbFirebase, "bookings"));
    const bookings = bookingsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);

    if (bookings.length === 0) {
      return "No bookings recorded yet.";
    }

    return bookings
      .map(
        (b: any) =>
          `- ${b.user_name}: ${b.total_price}VND for ${
            b.seats?.length || 0
          } seats`
      )
      .join("\n");
  } catch (error) {
    console.error("[v0] Error fetching recent bookings:", error);
    return "Unable to fetch booking data.";
  }
}

/**
 * Get movies count by genre
 */
export async function getMoviesByGenre(): Promise<string> {
  try {
    const moviesSnapshot = await getDocs(collection(dbFirebase, "movies"));
    const genreCounts: { [key: string]: number } = {};

    moviesSnapshot.docs.forEach((doc) => {
      const genre = doc.data().genre || "Unknown";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    if (Object.keys(genreCounts).length === 0) {
      return "No movies recorded.";
    }

    return Object.entries(genreCounts)
      .map(([genre, count]) => `${genre}: ${count}`)
      .join(", ");
  } catch (error) {
    console.error("[v0] Error fetching movies by genre:", error);
    return "Unable to fetch movie data.";
  }
}

/**
 * Format all data for chatbot context
 */
export async function formatChatbotContext(): Promise<string> {
  try {
    const stats = await getCinemaStats();
    const recentBookings = await getRecentBookings(3);
    const moviesByGenre = await getMoviesByGenre();

    const context = `
=== CINEMA MANAGEMENT SYSTEM - REAL DATA ===
Movies Available: ${stats.totalMovies}
Theaters: ${stats.totalTheaters}
Total Bookings: ${stats.totalBookings}
Total Revenue: ${stats.totalRevenue}VND
Booked Seats: ${stats.bookedSeatsCount}
Top Movie: ${stats.topMovie}

Recent Bookings (last 3):
${recentBookings}

Movies by Genre:
${moviesByGenre}

---
All data is current and synced from Firebase.
`;
    return context;
  } catch (error) {
    console.error("[v0] Error formatting chatbot context:", error);
    return "Chatbot running with limited data access.";
  }
}
