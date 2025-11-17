# Firebase Sync System - Testing & Verification Guide

## Overview

This guide explains how to test and verify the complete Firebase synchronization system for Movies, Theaters, Screens, and Showtimes.

---

## 1. Setup & Prerequisites

### Before Testing:

1. Ensure Firebase is properly configured in `src/db/firebase.js`
2. Network listener is initialized in your app root (call `initNetworkListener()` on app start)
3. Database is initialized with `initDatabase()` and `getDB()`
4. You have internet connection for Firebase testing

### Initial Setup Code (in your main app file):

\`\`\`javascript
import { initDatabase } from './src/db/init';
import { initNetworkListener } from './src/cloud/sync-manager';

// App initialization
useEffect(() => {
const setupApp = async () => {
await initDatabase();
initNetworkListener();
};
setupApp();
}, []);
\`\`\`

---

## 2. Testing Movies Sync

### Test Case 2.1: Add Movie with Firebase Sync

**Objective**: Verify new movie is synced to Firebase

**Steps**:

1. Open Admin Movies Management screen
2. Click "Add Movie"
3. Fill in movie details:
   - Title: "Test Movie 1"
   - Genre: "Action"
   - Duration: 120
   - Other fields: optional
4. Click "Save"

**Expected Results**:

- Console shows: `✅ Thêm phim mới thành công!`
- Console shows: `[v0] ☁️ Added movie "Test Movie 1" to Firebase (ID: X)`
- Firebase Console > Firestore > movies collection shows new document

**Verification in Firebase**:

- Go to Firebase Console > Firestore
- Check `movies` collection
- Find document with ID matching console output
- Verify all fields are present

---

### Test Case 2.2: Update Movie with Firebase Sync

**Objective**: Verify movie updates are synced to Firebase

**Steps**:

1. In Movies Management screen, click "Edit" on a movie
2. Change the genre from "Action" to "Comedy"
3. Change rating to 8.5
4. Click "Save"

**Expected Results**:

- Console shows: `✏️ Cập nhật phim thành công!`
- Console shows: `[v0] ☁️ Updated movie "Test Movie 1" in Firebase`
- Firebase document updates with new values

**Verification**:

- Check Firebase Console > Firestore > movies collection
- Verify genre changed to "Comedy" and rating is 8.5

---

### Test Case 2.3: Delete Movie with Firebase Sync

**Objective**: Verify movie deletion is synced to Firebase

**Steps**:

1. In Movies Management, find the test movie
2. Click "Delete"
3. Confirm deletion

**Expected Results**:

- Console shows: `🗑️ Xóa phim thành công!`
- Console shows: `[v0] ☁️ Deleted movie (ID: X) from Firebase`
- Firebase document is removed

**Verification**:

- Check Firebase Console > Firestore > movies collection
- Document should no longer exist

---

## 3. Testing Theaters Sync

### Test Case 3.1: Add Theater with Firebase Sync

**Objective**: Verify new theater is synced

**Steps**:

1. Open Admin Theaters Management
2. Click "Add Theater"
3. Fill in:
   - Name: "Test Cinema"
   - Location: "Ho Chi Minh City"
4. Click "Save"

**Expected Results**:

- Console shows: `✅ Thêm rạp mới thành công!`
- Console shows: `[v0] ☁️ Added theater "Test Cinema" to Firebase (ID: X)`

**Verification**:

- Firebase Console > Firestore > theaters collection
- New document exists with ID

---

### Test Case 3.2: Update Theater with Firebase Sync

**Objective**: Verify theater updates sync to Firebase

**Steps**:

1. Click "Edit" on the test theater
2. Change location to "Binh Duong"
3. Click "Save"

**Expected Results**:

- Console shows: `✏️ Cập nhật rạp thành công!`
- Console shows: `[v0] ☁️ Updated theater "Test Cinema" in Firebase`

---

### Test Case 3.3: Delete Theater with Screens Cascade

**Objective**: Verify theater and its screens are deleted from Firebase

**Steps**:

1. Add a screen to the test theater first (if not exists)
2. Delete the theater
3. Confirm deletion

**Expected Results**:

- Console shows deletion messages for each screen
- Console shows: `[v0] ☁️ Deleted screen (ID: X) from Firebase`
- Console shows: `[v0] ☁️ Deleted theater (ID: X) from Firebase`
- Theater and related screens no longer in Firebase

---

## 4. Testing Screens Sync

### Test Case 4.1: Add Screen with Firebase Sync

**Objective**: Verify new screen is synced

**Steps**:

1. In Theaters Management, click "Add Screen"
2. Fill in:
   - Theater: Select test theater
   - Screen Name: "Screen A"
   - Rows: 10
   - Cols: 12
3. Click "Save"

**Expected Results**:

- Console shows: `✅ Thêm phòng chiếu thành công!`
- Console shows: `[v0] ☁️ Added screen "Screen A" to Firebase (ID: X)`

---

### Test Case 4.2: Update Screen with Firebase Sync

**Objective**: Verify screen updates sync

**Steps**:

1. Click "Edit" on the test screen
2. Change rows to 12, cols to 14
3. Click "Save"

**Expected Results**:

- Console shows: `✏️ Cập nhật phòng chiếu thành công!`
- Console shows: `[v0] ☁️ Updated screen "Screen A" in Firebase`

---

## 5. Testing Showtimes Sync

### Test Case 5.1: Add Showtime with Firebase Sync

**Objective**: Verify new showtime is synced with all details

**Steps**:

1. Open Admin Showtimes Management
2. Click "Add Showtime"
3. Fill in:
   - Movie: Select test movie
   - Theater: Select test theater
   - Screen: Select test screen
   - Date & Time: Tomorrow at 14:00
   - Price: 120000
4. Click "Save"

**Expected Results**:

- Console shows: `✅ Thêm suất chiếu thành công!`
- Console shows: `[v0] ☁️ Added showtime to Firebase (ID: X)`
- Firebase includes movie_title, theater_name, screen_name

---

### Test Case 5.2: Update Showtime with Firebase Sync

**Objective**: Verify showtime updates sync

**Steps**:

1. Click "Edit" on test showtime
2. Change price to 150000
3. Click "Save"

**Expected Results**:

- Console shows: `✏️ Cập nhật suất chiếu thành công!`
- Console shows: `[v0] ☁️ Updated showtime in Firebase (ID: X)`

---

### Test Case 5.3: Delete Showtime with Firebase Sync

**Objective**: Verify showtime deletion syncs

**Steps**:

1. Click "Delete" on test showtime

**Expected Results**:

- Console shows: `🗑️ Xóa suất chiếu thành công!`
- Console shows: `[v0] ☁️ Deleted showtime (ID: X) from Firebase`

---

## 6. Testing Offline Mode & Queue

### Test Case 6.1: Offline Add Operation

**Objective**: Verify operations queue when offline

**Steps**:

1. Disable internet (airplane mode or disable WiFi)
2. Add a new movie: "Offline Test Movie"
3. Check console

**Expected Results**:

- Console shows: `[v0] Offline, lưu vào queue`
- Console shows: `[v0] 📦 Thêm vào queue: add (movie) - Total: 1`

---

### Test Case 6.2: Queue Processing on Reconnect

**Objective**: Verify queued operations sync when reconnected

**Steps**:

1. (From previous test) Still offline with queued movie
2. Enable internet connection
3. Wait 5 seconds, check console

**Expected Results**:

- Console shows: `[v0] Trạng thái mạng: 🌐 ONLINE`
- Console shows: `[v0] Mạng trở lại, tiến hành đồng bộ...`
- Console shows: `[v0] ⚙️ Xử lý 1 hành động trong queue...`
- Console shows: `[v0] ▶️ Xử lý: add (movie)`
- Console shows: `[v0] ☁️ Added movie "Offline Test Movie" to Firebase`
- Firebase now contains the movie

---

### Test Case 6.3: Multiple Offline Operations

**Objective**: Verify queue handles multiple operations

**Steps**:

1. Disable internet
2. Add 3 movies
3. Add 1 theater
4. Enable internet
5. Check console

**Expected Results**:

- Offline queue shows 4 items
- When online, all 4 items sync to Firebase
- Console shows: `[v0] ⚙️ Xử lý 4 hành động trong queue...`

---

## 7. Console Log Checklist

### Expected Log Patterns:

**Add Operation**:
\`\`\`
✅ [Entity] mới thành công!
[v0] ☁️ Added [entity] to Firebase (ID: X)
\`\`\`

**Update Operation**:
\`\`\`
✏️ Cập nhật [entity] thành công!
[v0] ☁️ Updated [entity] in Firebase
\`\`\`

**Delete Operation**:
\`\`\`
🗑️ Xóa [entity] thành công!
[v0] ☁️ Deleted [entity] (ID: X) from Firebase
\`\`\`

**Offline Mode**:
\`\`\`
[v0] Offline, lưu vào queue
[v0] 📦 Thêm vào queue: [action] ([type]) - Total: X
\`\`\`

**Network Recovery**:
\`\`\`
[v0] Trạng thái mạng: 🌐 ONLINE
[v0] Mạng trở lại, tiến hành đồng bộ...
[v0] ⚙️ Xử lý X hành động trong queue...
\`\`\`

---

## 8. Firebase Console Verification

### Check Firestore Collections:

**Movies Collection** (`movies`):

- Documents should match added/updated movies
- Each doc has: id, title, posterUrl, description, genre, duration, language, director, cast, release_date, rating, lastSyncTime

**Theaters Collection** (`theaters`):

- Documents match theaters
- Each doc has: id, name, location, lastSyncTime

**Screens Collection** (`screens`):

- Documents match screens
- Each doc has: id, theater_id, name, rows, cols, seat_map, lastSyncTime

**Showtimes Collection** (`showtimes`):

- Documents match showtimes
- Each doc has: id, movie_id, screen_id, start_time, price, status, movie_title, theater_name, screen_name, lastSyncTime

---

## 9. Troubleshooting

### Issue: Console shows "Database chưa sẵn sàng"

**Solution**: Ensure `initDatabase()` is called before any CRUD operations

### Issue: Firebase not updating after add/edit/delete

**Solution**:

1. Check if `initNetworkListener()` is called
2. Verify internet connection
3. Check Firebase credentials in `firebase.js`
4. Check Firestore security rules allow write access

### Issue: Queue not processing on reconnect

**Solution**:

1. Verify `NetInfo.addEventListener` is working
2. Check network state changes to online
3. Check browser console for Firebase errors

### Issue: Offline operations not queuing

**Solution**:

1. Confirm airplane mode is on or WiFi disabled
2. Check `isNetworkOnline()` returns false
3. Verify `addToSyncQueue()` is called in catch blocks

---

## 10. Success Criteria

**All tests pass when**:

- ✅ All CRUD operations log success messages
- ✅ Firebase Firestore reflects all changes
- ✅ Offline operations queue correctly
- ✅ Queue processes on network recovery
- ✅ No console errors during operations
- ✅ Data consistency between SQLite and Firebase

---

## 11. Running All Tests Systematically

**Complete Test Flow** (15-20 minutes):

1. Start app, check network listener initialized
2. Test 2.1 - 2.3 (Movies): Add, Update, Delete
3. Test 3.1 - 3.3 (Theaters): Add, Update, Delete with cascade
4. Test 4.1 - 4.2 (Screens): Add, Update
5. Test 5.1 - 5.3 (Showtimes): Add, Update, Delete
6. Test 6.1 - 6.3 (Offline): Queue and sync
7. Verify Firebase Console for all data
8. Check console logs match expected patterns

**Success**: All tests pass with correct log output and Firebase data
