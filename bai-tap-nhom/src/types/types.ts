// ==============================
// 📁 src/types/index.ts
// File định nghĩa tất cả các kiểu dữ liệu (TypeScript interface / type)
// cho toàn bộ ứng dụng React Native + SQLite (Rn Cinema Management App).
// ==============================

// ===== USERS =====
// Bảng người dùng (dành cho admin và khách hàng)
export interface User {
  id?: number; // ID tự tăng
  username: string; // Tên đăng nhập
  password: string; // Mật khẩu (lưu đơn giản trong DB SQLite)
  role: "admin" | "customer"; // Phân quyền: admin hoặc khách hàng
}

// ===== MOVIES =====
// Bảng phim — chứa thông tin chi tiết về phim
export interface Movie {
  id?: number; // ID phim
  title: string; // Tên phim
  posterUrl?: string; // Ảnh poster phim (URL hoặc path local)
  description?: string; // Mô tả phim
  genre?: string; // Thể loại (hành động, tình cảm,...)
  duration: number; // Thời lượng (phút)
  language?: string; // Ngôn ngữ
  director?: string; // Đạo diễn
  cast?: string; // Diễn viên chính
  release_date?: string; // Ngày khởi chiếu (ISO string)
  rating?: number; // Điểm đánh giá (dùng cho giao diện Home/MovieList)
}

// ===== THEATERS & SCREENS =====
// Bảng rạp chiếu phim
export interface Theater {
  id?: number; // ID rạp
  name: string; // Tên rạp
  location?: string; // Địa điểm rạp
}

// Bảng phòng chiếu (thuộc 1 rạp)
export interface Screen {
  id?: number; // ID phòng chiếu
  theater_id: number; // Khóa ngoại liên kết đến rạp
  name: string; // Tên phòng chiếu
  rows: number; // Số hàng ghế
  cols: number; // Số cột ghế
  seat_map: string; // Dữ liệu JSON lưu layout ghế {"A":[1,1,0,1]}
}

// ===== SHOWTIMES =====
// Bảng suất chiếu — liên kết phim + phòng chiếu
export interface Showtime {
  id?: number; // ID suất chiếu
  movie_id: number; // ID phim
  screen_id: number; // ID phòng chiếu
  start_time: string; // Thời gian bắt đầu chiếu (ISO string)
  price: number; // Giá vé
  status?: "active" | "cancelled"; // Trạng thái suất chiếu
}

export interface ShowtimeWithDetails extends Showtime {
  movie_title?: string;
  theater_name?: string;
  screen_name?: string;
}

// ===== BOOKINGS =====
// Bảng đặt vé (booking)
export interface Booking {
  id?: number; // ID booking
  showtime_id: number; // Khóa ngoại liên kết suất chiếu
  user_name: string; // Tên khách hàng (đơn giản)
  seats: string; // Danh sách ghế (dạng JSON string: ["A1","A2"])
  total_price: number; // Tổng tiền vé
  created_at: string; // Ngày tạo đơn (ISO string)
  status?: "booked" | "cancelled" | "paid"; // Trạng thái: đã đặt / hủy / đã thanh toán
}

// ===== UI TYPES =====
// Các kiểu dữ liệu phục vụ cho giao diện người dùng (frontend)

// Dữ liệu cho thẻ phim ở trang Home / MovieList
export interface MovieCardData {
  id: number;
  title: string;
  posterUrl?: string;
  rating?: number;
  nextShowtime?: string; // Suất chiếu gần nhất
}

// Dữ liệu tóm tắt suất chiếu trong trang chi tiết phim
export interface ShowtimePreview {
  id: number;
  start_time: string;
  price: number;
}

// Dữ liệu chi tiết phim kèm danh sách suất chiếu
export interface MovieDetailData extends Movie {
  showtimes: ShowtimePreview[];
}

// Dữ liệu chi tiết 1 suất chiếu (kết hợp phim, rạp, phòng)
export interface ShowtimeDetailData {
  showtime: Showtime;
  movie: Movie;
  theater: Theater;
  screen: Screen;
}

// Trạng thái của từng ghế trong sơ đồ
export type SeatStatus = "free" | "selected" | "reserved" | "blocked";

// Thông tin 1 ghế (tọa độ và trạng thái)
export interface Seat {
  row: string; // Hàng ghế (A, B, C,...)
  col: number; // Cột (1, 2, 3,...)
  status: SeatStatus; // free / selected / reserved / blocked
}

// Dữ liệu grid ghế (một object chứa danh sách ghế theo từng hàng)
export interface SeatGrid {
  [row: string]: Seat[];
}

// Dữ liệu tổng hợp cho màn hình chọn ghế (SeatSelection)
export interface SeatSelectionData {
  showtime: ShowtimeDetailData; // Thông tin suất chiếu
  seats: SeatGrid; // Lưới ghế hiện tại
  selectedSeats: string[]; // Danh sách ghế người dùng chọn
  total: number; // Tổng tiền
}

// Dữ liệu form thanh toán (Payment)
export interface PaymentInfo {
  name: string; // Tên khách hàng
  email: string; // Email
  method: "cash" | "credit" | "momo" | "zalo" | "other"; // Phương thức thanh toán
  total: number; // Tổng tiền
  selectedSeats: string[]; // Danh sách ghế chọn
  showtime_id: number; // ID suất chiếu
}

// Dữ liệu chi tiết vé đã đặt (hiển thị ở màn MyBookings)
export interface BookingDetail extends Booking {
  movieTitle?: string; // Tên phim
  showtimeTime?: string; // Thời gian chiếu
  theaterName?: string; // Tên rạp
  screenName?: string; // Tên phòng chiếu
}
