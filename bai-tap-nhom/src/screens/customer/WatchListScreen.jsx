"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Alert, FlatList, Image, Modal, Pressable, Share, Text, View } from "react-native"
import { cancelBooking, getUserBookings, updateBookingStatus } from "../../db/booking.repo"
import { getCurrentUserEmail } from "../../utils/auth"; // Import getCurrentUserEmail to get actual logged-in user

const handleExport = (booking) => {
  if (!booking) return

  try {
    const seatsArray = Array.isArray(booking?.seats)
      ? booking.seats
      : typeof booking?.seats === "string"
        ? JSON.parse(booking.seats)
        : []
    const seatsString = seatsArray.join(", ") || "N/A"

    const message = `
📋 THÔNG TIN VÉ ĐẶT
━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Phim: ${booking?.movie_title || "N/A"}
🏢 Rạp: ${booking?.theater_name || "N/A"}
🎞️ Phòng: ${booking?.screen_name || "N/A"}
👤 Khách: ${booking?.user_name || "N/A"}
🪑 Ghế: ${seatsString}
🕐 Giờ chiếu: ${booking?.start_time ? new Date(booking.start_time).toLocaleString("vi-VN") : "N/A"}
💰 Tổng tiền: ${booking?.total_price ? booking.total_price.toLocaleString() : "0"} VND
📅 Đặt lúc: ${booking?.created_at ? new Date(booking.created_at).toLocaleString("vi-VN") : "N/A"}
✅ Trạng thái: ${booking?.status || "N/A"}
━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim()

    Share.share({
      message,
      title: "Thông tin vé đặt",
    })
  } catch (err) {
    console.error("[v0] Export error:", err)
    Alert.alert("Lỗi", "Không thể chia sẻ thông tin vé")
  }
}

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  accent: "#ffc107",
  cancelled: "#FF6B6B",
  paid: "#4ECDC4",
}

const PAYMENT_METHODS = [
  { id: "cash", label: "Tiền mặt", icon: "cash" },
  { id: "credit", label: "Thẻ tín dụng", icon: "card" },
  { id: "momo", label: "Momo", icon: "wallet" },
  { id: "zalo_pay", label: "Zalo Pay", icon: "logo-alipay" },
]

export default function WatchListScreen() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)

  // 📌 Load danh sách booking của user
  const loadBookings = () => {
    setLoading(true)
    const userEmail = getCurrentUserEmail()
    console.log(`[v0] 📋 Loading bookings for user: ${userEmail}`)

    getUserBookings(
      userEmail,
      (data) => {
        setBookings(data)
        setLoading(false)
      },
      (error) => {
        console.error(error)
        setLoading(false)
      },
    )
  }

  // Gọi lại mỗi khi quay lại trang
  useFocusEffect(
    useCallback(() => {
      loadBookings()
    }, []),
  )

  const handleDeleteBooking = (bookingId) => {
    Alert.alert("Hủy Booking", "Bạn có chắc muốn hủy booking này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: () => {
          cancelBooking(
            bookingId,
            () => {
              console.log("Booking cancelled successfully and seats restored")
              loadBookings()
            },
            (error) => {
              Alert.alert("Lỗi", "Không thể hủy booking. Vui lòng thử lại.")
              console.error(error)
            },
          )
        },
      },
    ])
  }

  const handlePaymentPress = (bookingId) => {
    setSelectedBookingId(bookingId)
    setSelectedPaymentMethod(null)
    setPaymentModal(true)
  }

  const handlePaymentConfirm = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán")
      return
    }

    updateBookingStatus(
      selectedBookingId,
      "paid",
      () => {
        Alert.alert("Thành công", `Thanh toán bằng ${selectedPaymentMethod} thành công!`)
        setPaymentModal(false)
        setSelectedBookingId(null)
        setSelectedPaymentMethod(null)
        loadBookings()
      },
      (error) => {
        Alert.alert("Lỗi", "Không thể xử lý thanh toán. Vui lòng thử lại.")
        console.error(error)
      },
    )
  }

  const formatShowtime = (startTime) => {
    const date = new Date(startTime)
    const timeString = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
    const dateString = date.toLocaleDateString("vi-VN")
    return `${dateString} - ${timeString}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "cancelled":
        return COLORS.cancelled
      case "paid":
        return COLORS.paid
      case "booked":
      default:
        return COLORS.primary
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "cancelled":
        return "Đã hủy"
      case "paid":
        return "Đã thanh toán"
      case "booked":
      default:
        return "Đã đặt"
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.card,
              borderRadius: 12,
              marginBottom: 12,
              overflow: "hidden",
              elevation: 3,
            }}
          >
            {/* Poster Image */}
            <View
              style={{
                flex: 1,
                aspectRatio: 3 / 4,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {item.posterUrl ? (
                <Image source={{ uri: item.posterUrl }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#444",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="image-outline" size={28} color="#888" />
                </View>
              )}
            </View>

            {/* Movie Details */}
            <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
              <View>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                {/* Rating and Genre */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="star" size={16} color={COLORS.accent} />
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {item.rating}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="film" size={16} color={COLORS.placeholder} />
                    <Text
                      style={{
                        color: COLORS.placeholder,
                        fontSize: 12,
                      }}
                    >
                      {item.genre}
                    </Text>
                  </View>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      color: COLORS.placeholder,
                      fontSize: 11,
                      marginBottom: 4,
                    }}
                  >
                    🎬 {item.theater_name} - {item.location}
                  </Text>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      color: COLORS.accent,
                      fontSize: 11,
                      fontWeight: "600",
                      marginBottom: 4,
                    }}
                  >
                    🕐 {formatShowtime(item.start_time)}
                  </Text>
                </View>

                {/* Year and Duration */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="calendar" size={14} color={COLORS.placeholder} />
                    <Text style={{ color: COLORS.placeholder, fontSize: 11 }}>
                      {new Date(item.start_time).getFullYear()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="time" size={14} color={COLORS.placeholder} />
                    <Text style={{ color: COLORS.placeholder, fontSize: 11 }}>{item.duration} minutes</Text>
                  </View>
                </View>

                {/* Seats Info */}
                <Text
                  style={{
                    color: COLORS.placeholder,
                    fontSize: 11,
                    marginBottom: 8,
                  }}
                >
                  💺 Ghế: {item.seats}
                </Text>

                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: getStatusColor(item.status),
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.background,
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Buttons Section */}
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}
            >
              {/* Payment Button and Warning */}
              <View style={{ alignItems: "center" }}>
                {item.status === "booked" && (
                  <>
                    <Pressable onPress={() => handlePaymentPress(item.id)}>
                      <Ionicons name="card" size={48} color={COLORS.primary} />
                    </Pressable>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: 11,
                        fontWeight: "bold",
                        marginTop: 8,
                        textAlign: "center",
                        maxWidth: 90,
                      }}
                    >
                      Vui lòng Thanh toán
                    </Text>
                  </>
                )}
              </View>
              <Pressable
                onPress={() => handleExport(item)}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Ionicons name="share-social" size={14} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>Chia sẻ</Text>
              </Pressable>

              {/* Delete Button */}
              {item.status !== "cancelled" && (
                <Pressable onPress={() => handleDeleteBooking(item.id)}>
                  <Ionicons name="trash" size={40} color={COLORS.primary} />
                </Pressable>
              )}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <Ionicons name="bookmark-outline" size={64} color={COLORS.placeholder} />
            <Text
              style={{
                color: COLORS.placeholder,
                fontSize: 16,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Bạn chưa có booking nào
            </Text>
          </View>
        )}
      />

      <Modal visible={paymentModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Chọn phương thức thanh toán
            </Text>

            {/* Payment Methods */}
            <View style={{ marginBottom: 24 }}>
              {PAYMENT_METHODS.map((method) => (
                <Pressable
                  key={method.id}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    marginBottom: 8,
                    borderRadius: 8,
                    backgroundColor: selectedPaymentMethod === method.id ? COLORS.primary : COLORS.background,
                    borderWidth: 2,
                    borderColor: selectedPaymentMethod === method.id ? COLORS.primary : COLORS.placeholder,
                  }}
                >
                  <Ionicons
                    name={method.icon}
                    size={24}
                    color={selectedPaymentMethod === method.id ? COLORS.text : COLORS.placeholder}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      color: selectedPaymentMethod === method.id ? COLORS.text : COLORS.placeholder,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {method.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={() => setPaymentModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.background,
                  borderWidth: 1,
                  borderColor: COLORS.placeholder,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Hủy
                </Text>
              </Pressable>

              <Pressable
                onPress={handlePaymentConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Xác nhận
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
