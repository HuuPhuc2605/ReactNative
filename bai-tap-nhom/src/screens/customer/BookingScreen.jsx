"use client";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import {
  canBookingOffline,
  isNetworkOnline,
  syncShowtimesFromCloud,
} from "../../cloud/sync-manager";
import { addBooking } from "../../db/booking.repo";
import { getDB } from "../../db/init";
import { getMovies } from "../../db/movie.repo";
import { getCurrentUserEmail } from "../../utils/auth";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  accent: "#ffc107",
  available: "#0066ff",
  selected: "#E50914",
  booked: "#333",
};

export default function BookingScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMap, setSeatMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [networkOnline, setNetworkOnline] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("customer");
  const [showtimeRefreshLoading, setShowtimeRefreshLoading] = useState(false);

  useEffect(() => {
    const userEmail = getCurrentUserEmail();
    const finalUserEmail =
      userEmail && userEmail.trim() !== "" ? userEmail : "customer";
    setCurrentUserEmail(finalUserEmail);
    console.log("[v0] Current user email set to:", finalUserEmail);

    loadMovieAndShowtimes();
    setNetworkOnline(isNetworkOnline());
  }, [movieId]);

  const loadMovieAndShowtimes = async () => {
    try {
      getMovies({}, (data) => {
        const foundMovie = data.find((m) => m.id.toString() === movieId);
        setMovie(foundMovie || null);
      });

      const db = getDB();
      if (db) {
        const result = await db.getAllAsync(
          `SELECT 
            s.id,
            s.start_time,
            s.price,
            s.booked_seats,
            th.name as theater_name,
            sc.name as screen_name,
            sc.rows,
            sc.cols,
            sc.seat_map
          FROM showtimes s
          JOIN screens sc ON s.screen_id = sc.id
          JOIN theaters th ON sc.theater_id = th.id
          WHERE s.movie_id = ? AND s.status = 'active' AND s.start_time > datetime('now')
          ORDER BY s.start_time ASC;`,
          [movieId]
        );

        const showtimesWithBookedSeats = result.map((showtime) => {
          let bookedSeatsArray = [];

          if (showtime.booked_seats) {
            try {
              // Handle if it's already a string
              if (typeof showtime.booked_seats === "string") {
                const trimmed = showtime.booked_seats.trim();
                if (trimmed.length > 0) {
                  bookedSeatsArray = JSON.parse(trimmed);
                }
              } else if (Array.isArray(showtime.booked_seats)) {
                bookedSeatsArray = showtime.booked_seats;
              }
              console.log(
                `[v0] Showtime ${showtime.id} booked_seats raw:`,
                showtime.booked_seats
              );
              console.log(
                `[v0] Parsed booked_seats for showtime ${showtime.id}:`,
                bookedSeatsArray
              );
            } catch (e) {
              console.error(
                `[v0] Error parsing booked_seats for ${showtime.id}:`,
                e,
                "Raw value:",
                showtime.booked_seats
              );
              bookedSeatsArray = [];
            }
          }

          return {
            ...showtime,
            booked_seats: Array.isArray(bookedSeatsArray)
              ? bookedSeatsArray
              : [],
          };
        });

        setShowtimes(showtimesWithBookedSeats);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error loading movie and showtimes:", err);
      setLoading(false);
    }
  };

  const fetchFreshShowtimeFromCloud = async (showtimeId) => {
    try {
      setShowtimeRefreshLoading(true);

      // Sync latest showtimes from Firebase to get updated booked_seats
      if (isNetworkOnline()) {
        console.log(
          "[v0] 🔄 Syncing latest showtime data from cloud before selecting..."
        );
        await syncShowtimesFromCloud();
      }

      // Re-fetch the specific showtime with latest data
      const db = getDB();
      if (db) {
        const freshShowtime = await db.getFirstAsync(
          `SELECT 
            s.id,
            s.start_time,
            s.price,
            s.booked_seats,
            th.name as theater_name,
            sc.name as screen_name,
            sc.rows,
            sc.cols,
            sc.seat_map
          FROM showtimes s
          JOIN screens sc ON s.screen_id = sc.id
          JOIN theaters th ON sc.theater_id = th.id
          WHERE s.id = ?;`,
          [showtimeId]
        );

        if (freshShowtime) {
          let bookedSeatsArray = [];
          try {
            if (typeof freshShowtime.booked_seats === "string") {
              const trimmed = freshShowtime.booked_seats.trim();
              if (trimmed.length > 0) {
                bookedSeatsArray = JSON.parse(trimmed);
              }
            } else if (Array.isArray(freshShowtime.booked_seats)) {
              bookedSeatsArray = freshShowtime.booked_seats;
            }
            console.log(
              `[v0] ✅ Fresh showtime ${freshShowtime.id} booked_seats:`,
              bookedSeatsArray
            );
          } catch (e) {
            console.error(
              `[v0] Error parsing fresh booked_seats for ${freshShowtime.id}:`,
              e
            );
            bookedSeatsArray = [];
          }

          return {
            ...freshShowtime,
            booked_seats: Array.isArray(bookedSeatsArray)
              ? bookedSeatsArray
              : [],
          };
        }
      }

      return null;
    } catch (err) {
      console.warn(
        "[v0] ⚠️ Warning: Could not fetch fresh showtime data:",
        err
      );
      return null;
    } finally {
      setShowtimeRefreshLoading(false);
    }
  };

  const handleSelectShowtime = async (showtime) => {
    const freshShowtime = await fetchFreshShowtimeFromCloud(showtime.id);
    const showtimeToUse = freshShowtime || showtime;

    setSelectedShowtime(showtimeToUse);
    setSelectedSeats([]);

    try {
      const seatMapData = JSON.parse(showtimeToUse.seat_map);
      const virtualSeatMap = JSON.parse(JSON.stringify(seatMapData));

      const bookedSeats = Array.isArray(showtimeToUse.booked_seats)
        ? showtimeToUse.booked_seats
        : [];
      console.log(
        `[v0] Processing showtime ${showtimeToUse.id} with ${bookedSeats.length} booked seats:`,
        bookedSeats
      );

      bookedSeats.forEach((seatCode) => {
        if (typeof seatCode === "string" && seatCode.length > 1) {
          const row = seatCode.charAt(0).toUpperCase(); // 'A', 'B', etc
          const col = parseInt(seatCode.substring(1)) - 1; // Convert to 0-indexed

          console.log(
            `[v0] Marking booked seat: ${seatCode} at row=${row}, col=${col}`
          );

          if (virtualSeatMap[row] && virtualSeatMap[row][col] !== undefined) {
            virtualSeatMap[row][col] = 2; // Mark as booked (status 2 = booked)
            console.log(`[v0] Successfully marked ${seatCode} as booked`);
          } else {
            console.warn(`[v0] Could not find seat position for ${seatCode}`);
          }
        }
      });

      setSeatMap(virtualSeatMap);
      console.log(
        `[v0] Virtual seat map created with ${bookedSeats.length} booked seats`
      );
    } catch (e) {
      console.error(`[v0] Error parsing seat_map or booked_seats:`, e);
      const defaultMap = {};
      for (let i = 0; i < showtimeToUse.rows; i++) {
        const row = String.fromCharCode(65 + i);
        defaultMap[row] = Array(showtimeToUse.cols).fill(1);
      }

      const bookedSeats = Array.isArray(showtimeToUse.booked_seats)
        ? showtimeToUse.booked_seats
        : [];
      bookedSeats.forEach((seatCode) => {
        if (typeof seatCode === "string" && seatCode.length > 1) {
          const row = seatCode.charAt(0).toUpperCase();
          const col = parseInt(seatCode.substring(1)) - 1;
          if (defaultMap[row] && defaultMap[row][col] !== undefined) {
            defaultMap[row][col] = 2;
          }
        }
      });
      setSeatMap(defaultMap);
    }
  };

  const toggleSeat = (row, col) => {
    const seatCode = `${row}${col + 1}`;
    const seatStatus = seatMap[row][col];

    const bookedSeats = Array.isArray(selectedShowtime.booked_seats)
      ? selectedShowtime.booked_seats
      : [];
    const isBooked = seatStatus === 2 || bookedSeats.includes(seatCode);

    if (isBooked) {
      Alert.alert(
        "Ghế đã bán",
        `Ghế ${seatCode} đã được đặt. Vui lòng chọn ghế khác.`
      );
      console.log(`[v0] Attempt to book already booked seat: ${seatCode}`);
      return;
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seatCode)) {
        return prev.filter((s) => s !== seatCode);
      } else {
        return [...prev, seatCode];
      }
    });
  };

  const handleBooking = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn suất chiếu và ghế ngồi");
      return;
    }

    if (!canBookingOffline()) {
      Alert.alert(
        "❌ Không có mạng",
        "Bạn cần kết nối mạng để có thể đặt vé.\nXin vui lòng kiểm tra kết nối WiFi hoặc 3G/4G.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const totalPrice = selectedSeats.length * selectedShowtime.price;
      const finalUserName =
        currentUserEmail && currentUserEmail.trim() !== ""
          ? currentUserEmail
          : "customer";

      const bookingData = {
        showtime_id: selectedShowtime.id,
        user_name: finalUserName,
        seats: selectedSeats,
        total_price: totalPrice,
      };

      console.log("[v0] Creating booking with user_name:", finalUserName);

      addBooking(
        bookingData,
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));

          try {
            console.log(
              "[v0] Syncing showtimes from Firebase after booking..."
            );
            await syncShowtimesFromCloud();
            console.log("[v0] ✅ Showtimes synced from Firebase");
          } catch (syncErr) {
            console.warn(
              "[v0] ⚠️ Warning: Could not sync from Firebase:",
              syncErr
            );
          }

          loadMovieAndShowtimes();

          Alert.alert(
            "Thành công",
            `Đã đặt vé ${selectedSeats.join(
              ", "
            )} - Tổng giá: ${totalPrice.toLocaleString()} đ`,
            [
              {
                text: "OK",
                onPress: () => router.push("/(customer)/(tabs)/my-bookings"),
              },
            ]
          );
        },
        (err) => {
          const errorMessage =
            err?.message || "Không thể đặt vé. Vui lòng thử lại.";
          Alert.alert("Lỗi đặt vé", errorMessage);
        }
      );
    } catch (err) {
      console.error("[v0] Booking error:", err);
      Alert.alert("Lỗi", "Lỗi không xác định");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.text }}>Đang tải...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.text }}>Không tìm thấy phim</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {!networkOnline && (
        <View
          style={{
            backgroundColor: "#fee2e2",
            borderLeftWidth: 4,
            borderLeftColor: "#ef4444",
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: "#991b1b", fontWeight: "bold", fontSize: 14 }}>
            ⚠️ Chế độ Offline
          </Text>
          <Text style={{ color: "#991b1b", fontSize: 12, marginTop: 4 }}>
            Bạn không thể đặt vé khi không có mạng. Hãy bật WiFi hoặc 3G/4G.
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.card,
          borderBottomWidth: 1,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </Pressable>
        <Text
          style={{
            color: COLORS.text,
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 12,
            flex: 1,
          }}
        >
          {movie.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 12,
            }}
          >
            Chọn suất chiếu
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {showtimes.map((showtime) => (
              <Pressable
                key={showtime.id}
                onPress={() => handleSelectShowtime(showtime)}
                disabled={showtimeRefreshLoading}
                style={{
                  backgroundColor:
                    selectedShowtime?.id === showtime.id
                      ? COLORS.primary
                      : COLORS.card,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginRight: 12,
                  borderWidth: selectedShowtime?.id === showtime.id ? 0 : 1,
                  borderColor: COLORS.placeholder,
                  opacity: showtimeRefreshLoading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color:
                      selectedShowtime?.id === showtime.id
                        ? COLORS.text
                        : COLORS.placeholder,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  {new Date(showtime.start_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text
                  style={{
                    color:
                      selectedShowtime?.id === showtime.id
                        ? COLORS.text
                        : COLORS.placeholder,
                    fontSize: 12,
                  }}
                >
                  {showtime.theater_name} - {showtime.screen_name}
                </Text>
                <Text
                  style={{
                    color:
                      selectedShowtime?.id === showtime.id
                        ? COLORS.text
                        : COLORS.placeholder,
                    fontSize: 12,
                  }}
                >
                  {showtime.price.toLocaleString()} đ
                </Text>
                {showtimeRefreshLoading &&
                  selectedShowtime?.id === showtime.id && (
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 11,
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      🔄 Đang cập nhật...
                    </Text>
                  )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {selectedShowtime && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                color: COLORS.text,
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Chọn ghế ngồi
            </Text>

            <View
              style={{
                backgroundColor: COLORS.card,
                padding: 16,
                borderRadius: 8,
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "80%",
                  height: 20,
                  backgroundColor: COLORS.placeholder,
                  borderRadius: 10,
                  marginBottom: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.background,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  SCREEN
                </Text>
              </View>

              <View>
                {Object.entries(seatMap).map(([row, seats]) => (
                  <View
                    key={row}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 12,
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.text,
                        width: 20,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      {row}
                    </Text>
                    {seats.map((seat, col) => {
                      const seatCode = `${row}${col + 1}`;
                      const isSelected = selectedSeats.includes(seatCode);
                      const isBooked = seat === 2;
                      const isAvailable = seat === 1 && !isSelected;

                      return (
                        <Pressable
                          key={`${row}-${col}`}
                          onPress={() => toggleSeat(row, col)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            backgroundColor: isSelected
                              ? COLORS.selected
                              : isBooked
                              ? COLORS.booked
                              : COLORS.available,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: isSelected ? 2 : 1,
                            borderColor: isSelected
                              ? COLORS.accent
                              : COLORS.placeholder,
                            opacity: isSelected ? 1 : isBooked ? 0.5 : 1,
                          }}
                          disabled={isBooked || (!isAvailable && !isSelected)}
                        >
                          <Text
                            style={{
                              color: COLORS.text,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          >
                            {col + 1}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={{ marginTop: 20, width: "100%", gap: 8 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: COLORS.available,
                      borderColor: COLORS.placeholder,
                      borderWidth: 1,
                    }}
                  />
                  <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                    Ghế trống
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: COLORS.selected,
                      borderColor: COLORS.accent,
                      borderWidth: 2,
                    }}
                  />
                  <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                    Ghế được chọn
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: COLORS.booked,
                      borderColor: COLORS.placeholder,
                      borderWidth: 1,
                      opacity: 0.5,
                    }}
                  />
                  <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                    Ghế đã bán
                  </Text>
                </View>
              </View>
            </View>

            {selectedSeats.length > 0 && (
              <View
                style={{
                  backgroundColor: COLORS.card,
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.primary,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  Ghế đã chọn
                </Text>
                <Text
                  style={{ color: COLORS.text, fontSize: 14, marginBottom: 12 }}
                >
                  {selectedSeats.join(", ")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTopColor: COLORS.placeholder,
                    borderTopWidth: 1,
                  }}
                >
                  <Text style={{ color: COLORS.placeholder, fontSize: 14 }}>
                    Tổng giá:
                  </Text>
                  <Text
                    style={{
                      color: COLORS.accent,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {(
                      selectedSeats.length * selectedShowtime.price
                    ).toLocaleString()}{" "}
                    đ
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {selectedShowtime && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.card,
            borderTopWidth: 1,
          }}
        >
          <Pressable
            onPress={handleBooking}
            style={{
              backgroundColor:
                selectedSeats.length > 0 ? COLORS.primary : COLORS.placeholder,
              paddingVertical: 14,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              opacity: networkOnline ? 1 : 0.6,
            }}
            disabled={selectedSeats.length === 0 || !networkOnline}
          >
            <Text
              style={{ color: COLORS.text, fontSize: 16, fontWeight: "bold" }}
            >
              Đặt vé ({selectedSeats.length})
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
