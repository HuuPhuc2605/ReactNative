// app/admin/add-theater.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { addTheater, getTheaters } from "../../../db/theater.repo";

// Kiểu dữ liệu Theater
type Theater = {
  id?: number;
  name: string;
  location?: string;
};

// 🎨 Màu
const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  success: "#2ecc71",
  danger: "#e74c3c",
};

export default function AddTheaterScreen() {
  const router = useRouter();
  const [theater, setTheater] = useState<Theater>({ name: "", location: "" });

  // field là keyof Theater (chỉ 'name' hoặc 'location')
  const handleChange = (field: keyof Theater, value: string) => {
    setTheater((prev) => ({ ...prev, [field]: value }));
  };

  // Helper để gọi getTheaters dưới dạng Promise và có kiểu trả về
  const fetchAllTheaters = (): Promise<Theater[]> =>
    new Promise((resolve, reject) => {
      try {
        getTheaters(
          (data: Theater[]) => resolve(data),
          (err: any) => reject(err)
        );
      } catch (err) {
        reject(err);
      }
    });

  // Xử lý submit
  const handleSubmit = async () => {
    if (!theater.name?.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên rạp!");
      return;
    }

    try {
      // Lấy danh sách rạp hiện có có kiểu rõ ràng
      const existing: Theater[] = await fetchAllTheaters();

      const isDuplicate = existing.some(
        (t) =>
          (t.name || "").trim().toLowerCase() ===
          (theater.name || "").trim().toLowerCase()
      );

      if (isDuplicate) {
        Alert.alert("Rạp đã tồn tại", "Vui lòng nhập tên rạp khác!");
        return;
      }

      // Gọi repo thêm rạp
      addTheater(
        theatrePayloadCleaner(theater),
        () => {
          Alert.alert("✅ Thành công", "Đã thêm rạp chiếu mới!");
          router.back();
        },
        (err: Error) => {
          console.error("❌ Lỗi khi thêm rạp:", err.message);
          Alert.alert("Lỗi", "Không thể thêm rạp chiếu mới.");
        }
      );
    } catch (err) {
      console.error("❌ Lỗi khi kiểm tra rạp:", err);
      Alert.alert("Lỗi", "Không thể kiểm tra rạp hiện c��.");
    }
  };

  // đảm bảo payload gọn gàng
  function theatrePayloadCleaner(t: Theater) {
    return {
      name: (t.name || "").trim(),
      location: (t.location || "").trim(),
    };
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          🎭 Thêm Rạp Chiếu Phim
        </Text>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>Tên rạp *</Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
            }}
            value={theater.name}
            onChangeText={(value) => handleChange("name", value)}
            placeholder="Nhập tên rạp..."
            placeholderTextColor={COLORS.placeholder}
          />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>Địa điểm</Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
            }}
            value={theater.location}
            onChangeText={(value) => handleChange("location", value)}
            placeholder="Nhập địa điểm (tùy chọn)"
            placeholderTextColor={COLORS.placeholder}
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Lưu Rạp Chiếu
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={{
            borderColor: COLORS.placeholder,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Text style={{ color: COLORS.placeholder, fontSize: 15 }}>Huỷ</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
