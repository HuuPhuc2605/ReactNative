"use client";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  deleteScreen,
  deleteTheater,
  getScreensByTheater,
  getTheaters,
} from "../../../db/theater.repo";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  danger: "#e74c3c",
  gray: "#555",
};

export default function TheatersManagementScreen() {
  const router = useRouter();
  const [theaters, setTheaters] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // 📌 Load toàn bộ rạp + phòng chiếu
  const loadData = async () => {
    getTheaters(async (data) => {
      // Lấy danh sách phòng cho từng rạp
      const fullData = [];
      for (const theater of data) {
        const screens = await new Promise((resolve) =>
          getScreensByTheater(theater.id, resolve)
        );
        fullData.push({ ...theater, screens });
      }

      // 🔍 Lọc theo từ khóa
      const filtered = search
        ? fullData.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase())
          )
        : fullData;

      setTheaters(filtered);
    });
  };

  // 📲 Reload mỗi khi quay lại trang
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [search])
  );

  const handleDeleteTheater = (id) => {
    Alert.alert("Xác nhận", "Bạn muốn xóa rạp này (bao gồm phòng chiếu)?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () =>
          deleteTheater(
            id,
            () => {
              Alert.alert("✅ Thành công", "Đã xóa rạp!");
              loadData();
            },
            (err) => {
              console.error("[v0] Delete theater error:", err);
              const errorMsg =
                err?.message || err?.toString?.() || "Không thể xóa rạp.";
              Alert.alert("❌ Lỗi xóa rạp", errorMsg);
            }
          ),
      },
    ]);
  };

  const handleDeleteScreen = (id) => {
    if (!id) {
      console.error("[v0] Screen ID is undefined");
      Alert.alert("Lỗi", "ID phòng chiếu không hợp lệ");
      return;
    }

    console.log("[v0] Deleting screen with ID:", id);

    Alert.alert("Xóa phòng chiếu", "Bạn có chắc muốn xóa phòng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () =>
          deleteScreen(
            id,
            () => {
              Alert.alert("✅ Thành công", "Đã xóa phòng chiếu!");
              loadData();
            },
            (err) => {
              console.error("[v0] Error deleting screen:", err);
              const errorMsg =
                err?.message ||
                err?.toString?.() ||
                "Không thể xóa phòng chiếu.";
              Alert.alert("❌ Lỗi xóa phòng", errorMsg);
            }
          ),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{ color: COLORS.primary, fontSize: 22, fontWeight: "bold" }}
        >
          🎭 Quản lý Rạp & Phòng chiếu
        </Text>

        <Pressable
          onPress={() => router.push("/admin/theaters/add-theater")}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 4 }}>Thêm rạp</Text>
        </Pressable>
      </View>

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
          placeholder="Tìm rạp..."
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

      {/* Danh sách rạp */}
      <FlatList
        data={theaters}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
              setTimeout(() => setRefreshing(false), 600);
            }}
          />
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 12,
              padding: 12,
              marginBottom: 14,
            }}
          >
            {/* Thông tin rạp */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
                <Text style={{ color: COLORS.placeholder, fontSize: 13 }}>
                  📍 {item.location || "Chưa có địa chỉ"}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() =>
                    router.push(
                      `/admin/theaters/edit-theater?theaterId=${item.id}`
                    )
                  }
                >
                  <Ionicons name="create-outline" size={22} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleDeleteTheater(item.id)}>
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={COLORS.danger}
                  />
                </Pressable>
              </View>
            </View>

            {/* Danh sách phòng chiếu */}
            <Text
              style={{
                color: COLORS.primary,
                marginBottom: 6,
                fontWeight: "bold",
              }}
            >
              🎦 Phòng chiếu ({item.screens?.length || 0})
            </Text>

            {item.screens?.map((screen) => (
              <View
                key={screen.id}
                style={{
                  backgroundColor: "#222",
                  borderRadius: 8,
                  padding: 8,
                  marginBottom: 6,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ color: COLORS.text, fontWeight: "500" }}>
                    {screen.name}
                  </Text>
                  <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>
                    Hàng: {screen.rows} | Cột: {screen.cols}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() =>
                      router.push(
                        `/admin/theaters/edit-screen?screenId=${screen.id}`
                      )
                    }
                  >
                    <Ionicons name="create-outline" size={20} color="#fff" />
                  </Pressable>
                  <Pressable onPress={() => handleDeleteScreen(screen.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={COLORS.danger}
                    />
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Thêm phòng chiếu mới */}
            <Pressable
              onPress={() =>
                router.push(`/admin/theaters/add-screen?theaterId=${item.id}`)
              }
              style={{
                borderColor: COLORS.placeholder,
                borderWidth: 1,
                borderRadius: 10,
                paddingVertical: 6,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <Text style={{ color: COLORS.placeholder, fontSize: 13 }}>
                + Thêm phòng chiếu
              </Text>
            </Pressable>
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
            Không có rạp chiếu nào.
          </Text>
        )}
      />
    </View>
  );
}
