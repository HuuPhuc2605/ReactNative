/**
 * 🚀 SYNC INITIALIZATION HELPER
 *
 * Centralized initialization for Firebase sync system
 * Call this once in your app root component
 */

import { checkDatabaseReady, initDatabase } from "../db/init";
import { initNetworkListener, syncAllData } from "./sync-manager";

/**
 * Initialize complete sync system
 * Should be called in useEffect on app start
 */
export async function initializeSyncSystem() {
  try {
    console.log("[v0] 🚀 Initializing Cinema Sync System...");

    // Step 1: Initialize SQLite Database
    console.log("[v0] Step 1: Initializing SQLite Database...");
    const db = await initDatabase();

    if (!db) {
      throw new Error("Failed to initialize database");
    }

    const dbReady = await checkDatabaseReady();
    if (dbReady) {
      console.log("[v0] ✅ SQLite Database initialized successfully");
    }

    // Step 2: Initialize Network Listener
    console.log("[v0] Step 2: Setting up Network Listener...");
    await initNetworkListener();
    console.log("[v0] ✅ Network Listener initialized");

    // Step 3: Initial Sync with Firebase
    console.log("[v0] Step 3: Performing initial Firebase sync...");
    try {
      await syncAllData();
    } catch (syncError) {
      console.warn(
        "[v0] ⚠️ Initial sync failed (continuing offline):",
        syncError.message
      );
    }

    console.log("[v0] ✅ Sync System fully initialized!");
    console.log("[v0] 📡 Ready for CRUD operations");

    return true;
  } catch (err) {
    console.error("[v0] ❌ Failed to initialize sync system:", err);
    throw err;
  }
}

/**
 * Optional: Check sync system status
 */
export async function checkSyncStatus() {
  try {
    const isReady = await checkDatabaseReady();
    console.log(
      "[v0] Sync System Status:",
      isReady ? "✅ Ready" : "❌ Not Ready"
    );
    return isReady;
  } catch (err) {
    console.error("[v0] Error checking status:", err);
    return false;
  }
}
