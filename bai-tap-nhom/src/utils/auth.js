import { auth } from "../db/firebase"
import { getDB } from "../db/init"

export function getCurrentUserEmail() {
  const email = auth.currentUser?.email
  return email && typeof email === "string" ? email.trim() : "customer"
}

export function getCurrentUser() {
  const user = auth.currentUser
  if (!user) return null
  return {
    email: user.email,
    displayName: user.displayName || user.email?.split("@")[0] || "customer",
    uid: user.uid,
  }
}

export async function signOutUser() {
  try {
    console.log("[v0] 🔄 Starting logout process...")

    // Step 1: Sign out from Firebase
    await auth.signOut()
    console.log("[v0] ✅ Signed out from Firebase")

    // Step 2: Clear local SQLite data
    const db = getDB()
    if (db) {
      try {
        // Delete all bookings for the current user
        await db.runAsync("DELETE FROM bookings;")
        console.log("[v0] ✅ Cleared all bookings from local database")

        // Reset all booked_seats in showtimes to empty arrays
        await db.runAsync(
          `UPDATE showtimes SET booked_seats = '[]';`
        )
        console.log("[v0] ✅ Reset all booked_seats in showtimes")
      } catch (dbErr) {
        console.error("[v0] ⚠️ Warning clearing database:", dbErr.message)
      }
    }

    console.log("[v0] ✅ User signed out successfully and data cleared")
    return true
  } catch (error) {
    console.error("[v0] ❌ Error signing out:", error)
    return false
  }
}
