"use client";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { getTheaterById, updateTheater } from "../../../db/theater.repo";

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

export default function EditTheaterScreen() {
  const router = useRouter();
  const { theaterId } = useLocalSearchParams();
  const [theater, setTheater] = useState<Theater>({ name: "", location: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (theaterId) {
      const stringTheaterId = String(theaterId);

      console.log("[v0] Loading theater with ID:", {
        originalId: theaterId,
        stringId: stringTheaterId,
      });

      getTheaterById(
        stringTheaterId,
        (data: Theater) => {
          console.log("[v0] Loaded theater data:", data);
          setTheater(data);
          setLoading(false);
        },
        (err: any) => {
          console.error("❌ Lỗi khi tải rạp:", err);
          Alert.alert(
            "Lỗi",
            `Không thể tải thông tin rạp: ${err?.message || err}`
          );
          setLoading(false);
        }
      );
    }
  }, [theaterId]);

  const handleChange = (field: keyof Theater, value: string) => {
    setTheater((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!theater.name?.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên rạp!");
      return;
    }

    try {
      updateTheater(
        theatrePayloadCleaner(theater),
        () => {
          Alert.alert("✅ Thành công", "Đã cập nhật rạp chiếu!");
          router.back();
        },
        (err: Error) => {
          console.error("❌ Lỗi khi cập nhật rạp:", err.message);
          Alert.alert("Lỗi", "Không thể cập nhật rạp chiếu.");
        }
      );
    } catch (err) {
      console.error("❌ Lỗi:", err);
      Alert.alert("Lỗi", "Đã xảy ra lỗi không mong muốn.");
    }
  };

  function theatrePayloadCleaner(t: Theater) {
    return {
      id: t.id,
      name: (t.name || "").trim(),
      location: (t.location || "").trim(),
    };
  }

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
          ✏️ Chỉnh Sửa Rạp Chiếu Phim
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
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Cập Nhật Rạp
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
