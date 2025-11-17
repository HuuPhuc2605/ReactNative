export function generateFirebaseId() {
  // Generate a random string similar to Firestore auto-generated IDs
  // Firestore IDs are 20 characters long, alphanumeric, lowercase
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}
