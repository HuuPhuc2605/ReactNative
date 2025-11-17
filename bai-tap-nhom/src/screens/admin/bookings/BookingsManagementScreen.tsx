"use client";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import { syncBookingsFromCloud } from "../../../cloud/sync-manager";
import { getAllBookings, updateBookingStatus } from "../../../db/booking.repo";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  danger: "#e74c3c",
  success: "#27ae60",
  warning: "#f39c12",
  gray: "#555",
};

type BookingStatus = "booked" | "cancelled" | "paid";

interface Booking {
  id: number;
  user_name: string;
  movie_title: string;
  theater_name: string;
  screen_name: string;
  seats: string | string[];
  total_price: number;
  created_at: string;
  start_time: string;
  status: BookingStatus;
}

export default function BookingsManagementScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | BookingStatus>(
    "all"
  );
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const loadBookings = useCallback(async () => {
    if (loadingRef.current) {
      console.log("[v0] 📌 Load already in progress, skipping");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      console.log("[v0] 🔄 Syncing bookings from Firebase...");
      // First, sync any new bookings from Firebase to SQLite
      await syncBookingsFromCloud();

      console.log("[v0] 📖 Loading bookings from SQLite");
      // Then load all bookings from local database
      return new Promise<void>((resolve) => {
        getAllBookings(
          (data: Booking[]) => {
            let filtered = Array.isArray(data) ? [...data] : [];
            console.log(
              `[v0] ✅ Fetched ${filtered.length} bookings from database`
            );

            if (search) {
              const s = search.toLowerCase();
              filtered = filtered.filter(
                (b) =>
                  b.user_name?.toLowerCase().includes(s) ||
                  b.movie_title?.toLowerCase().includes(s) ||
                  b.theater_name?.toLowerCase().includes(s)
              );
            }

            if (selectedStatus !== "all") {
              filtered = filtered.filter((b) => b.status === selectedStatus);
            }

            console.log(`[v0] 📊 After filtering: ${filtered.length} bookings`);
            setBookings(filtered);
            loadingRef.current = false;
            setLoading(false);
            resolve();
          },
          (err: unknown) => {
            console.error("[v0] ❌ Error loading bookings:", err);
            Alert.alert("Lỗi", "Không thể tải danh sách booking");
            loadingRef.current = false;
            setLoading(false);
            resolve();
          }
        );
      });
    } catch (err) {
      console.error("[v0] ❌ Error in loadBookings:", err);
      loadingRef.current = false;
      setLoading(false);
    }
  }, [search, selectedStatus]);

  useFocusEffect(
    useCallback(() => {
      console.log("[v0] 👁️ Bookings screen focused - loading data");

      // Clear old data immediately on focus
      setBookings([]);
      loadingRef.current = false;

      // Load fresh data
      loadBookings();

      // Set up auto-refresh every 5 seconds while screen is visible
      refreshIntervalRef.current = setInterval(() => {
        console.log("[v0] ⏰ Auto-refreshing bookings...");
        loadBookings();
      }, 5000) as unknown as NodeJS.Timeout;

      // Cleanup interval when leaving screen
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }, [loadBookings])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadBookings();
    } finally {
      setRefreshing(false);
    }
  }, [loadBookings]);

  const handleStatusChange = (id: number, currentStatus: BookingStatus) => {
    const statusFlow: Record<BookingStatus, BookingStatus> = {
      booked: "paid",
      paid: "cancelled",
      cancelled: "booked",
    };
    const newStatus = statusFlow[currentStatus] || "booked";

    Alert.alert(
      "Đổi trạng thái",
      `Thay đổi từ ${currentStatus} → ${newStatus}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: () => {
            updateBookingStatus(
              id,
              newStatus,
              () => {
                Alert.alert("Thành công", "Cập nhật trạng thái booking");
                loadBookings();
              },
              (err: unknown) => {
                console.error("[v0] ❌ Update error:", err);
                Alert.alert("Lỗi", "Không thể cập nhật booking");
              }
            );
          },
        },
      ]
    );
  };

  const handleExport = (booking: Booking) => {
    try {
      const seatsArray =
        typeof booking.seats === "string"
          ? JSON.parse(booking.seats)
          : booking.seats;
      const seatsString = Array.isArray(seatsArray)
        ? seatsArray.join(", ")
        : "N/A";

      const message = `
📋 THÔNG TIN VÉ ĐẶT
━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Phim: ${booking.movie_title}
🏢 Rạp: ${booking.theater_name}
🎞️ Phòng: ${booking.screen_name}
👤 Khách: ${booking.user_name}
🪑 Ghế: ${seatsString}
🕐 Giờ chiếu: ${new Date(booking.start_time).toLocaleString("vi-VN")}
💰 Tổng tiền: ${booking.total_price.toLocaleString()} VND
📅 Đặt lúc: ${new Date(booking.created_at).toLocaleString("vi-VN")}
✅ Trạng thái: ${booking.status}
━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();

      Share.share({ message, title: "Thông tin vé đặt" });
    } catch (err) {
      console.error("[v0] ❌ Export error:", err);
      Alert.alert("Lỗi", "Không thể chia sẻ thông tin vé");
    }
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case "paid":
        return COLORS.success;
      case "cancelled":
        return COLORS.danger;
      default:
        return COLORS.warning;
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    const labels: Record<BookingStatus, string> = {
      booked: "Đã đặt",
      paid: "Đã thanh toán",
      cancelled: "Đã hủy",
    };
    return labels[status];
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      {/* Header */}
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        🎫 Quản lý đặt vé
      </Text>

      {loading && (
        <Text
          style={{ color: COLORS.placeholder, fontSize: 12, marginBottom: 8 }}
        >
          ⏳ Đang tải dữ liệu...
        </Text>
      )}

      {/* Search */}
      <View
        style={{
          backgroundColor: COLORS.card,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 10,
          paddingHorizontal: 10,
          marginBottom: 12,
        }}
      >
        <Ionicons name="search" size={18} color={COLORS.placeholder} />
        <TextInput
          placeholder="Tìm kiếm theo tên, phim hoặc rạp..."
          placeholderTextColor={COLORS.placeholder}
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            color: COLORS.text,
            paddingVertical: 8,
            marginLeft: 6,
          }}
        />
      </View>

      {/* Status Filter */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 12,
          paddingHorizontal: 2,
        }}
      >
        {(["all", "booked", "paid", "cancelled"] as const).map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                selectedStatus === status ? COLORS.primary : COLORS.card,
            }}
          >
            <Text
              style={{
                color: selectedStatus === status ? "#fff" : COLORS.placeholder,
                fontWeight: selectedStatus === status ? "bold" : "normal",
                fontSize: 12,
              }}
            >
              {status === "all"
                ? "Tất cả"
                : getStatusLabel(status as BookingStatus)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }: { item: Booking }) => (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
              borderLeftWidth: 4,
              borderLeftColor: getStatusColor(item.status),
            }}
          >
            {/* Top Row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {item.movie_title}
                </Text>
                <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                  {item.theater_name} - {item.screen_name}
                </Text>
              </View>

              {/* Status Badge */}
              <Pressable
                onPress={() => handleStatusChange(item.id, item.status)}
                style={{
                  backgroundColor: getStatusColor(item.status),
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: "bold",
                  }}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </Pressable>
            </View>

            {/* Details */}
            <View style={{ marginBottom: 8, gap: 4 }}>
              <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                👤 {item.user_name}
              </Text>
              <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                🪑 Ghế:{" "}
                {Array.isArray(item.seats)
                  ? item.seats.join(", ")
                  : JSON.parse(item.seats).join(", ")}
              </Text>
              <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                🕐 {new Date(item.start_time).toLocaleString("vi-VN")}
              </Text>
              <Text
                style={{ color: COLORS.text, fontSize: 12, fontWeight: "bold" }}
              >
                💰 {item.total_price.toLocaleString()} VND
              </Text>
            </View>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
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
                <Text
                  style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}
                >
                  Chia sẻ
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: COLORS.placeholder,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {loading
              ? "⏳ Đang tải dữ liệu..."
              : "Không có booking nào được tìm thấy."}
          </Text>
        )}
      />
    </View>
  );
}
