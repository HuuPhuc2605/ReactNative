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
import { getDB } from "../../../db/init";
import { updateScreen } from "../../../db/theater.repo";
import type { Screen } from "../../../types/types";
import { generateRowLabels } from "../../../utils/row-converter";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  success: "#2ecc71",
  danger: "#e74c3c",
};

export default function EditScreenScreen() {
  const router = useRouter();
  const { screenId } = useLocalSearchParams();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadScreen();
  }, [screenId]);

  const loadScreen = async () => {
    try {
      const db = getDB();
      if (!db) throw new Error("Database chưa sẵn sàng");

      const screenIdStr = Array.isArray(screenId)
        ? screenId[0]
        : String(screenId);

      console.log("[v0] Loading screen with ID (string):", screenIdStr);

      if (!screenIdStr) {
        Alert.alert("Lỗi", "ID phòng chiếu không hợp lệ");
        router.back();
        return;
      }

      const data = await db.getFirstAsync(
        "SELECT * FROM screens WHERE id = ?;",
        [screenIdStr]
      );

      if (data) {
        console.log("[v0] Loaded screen data:", data);
        setScreen(data as Screen);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy phòng chiếu");
        router.back();
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải phòng:", err);
      Alert.alert("Lỗi", "Không thể tải thông tin phòng.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getRowLabelsPreview = (rowCount: number) => {
    if (rowCount < 1 || rowCount > 26) return "";
    const labels = generateRowLabels(rowCount);
    return labels.slice(0, 3).join(", ") + (rowCount > 3 ? ", ..." : "");
  };

  const handleChange = (field: keyof Screen, value: string | number) => {
    if (screen) {
      if (field === "rows" || field === "cols") {
        const numValue = Number.parseInt(value as string);
        if (numValue < 1 || isNaN(numValue)) return;
        setScreen({ ...screen, [field]: numValue });
      } else {
        setScreen({ ...screen, [field]: value });
      }
    }
  };

  const handleSubmit = async () => {
    if (!screen || !screen.name?.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên phòng!");
      return;
    }

    if (screen.rows < 1 || screen.cols < 1) {
      Alert.alert("Lỗi", "Số hàng và cột phải >= 1");
      return;
    }

    setSubmitting(true);
    updateScreen(
      {
        id: screen.id,
        theater_id: screen.theater_id,
        name: screen.name.trim(),
        rows: screen.rows,
        cols: screen.cols,
        seat_map: screen.seat_map || "[]",
      },
      () => {
        Alert.alert("✅ Thành công", "Đã cập nhật phòng chiếu!");
        router.back();
      },
      (err: Error) => {
        console.error("❌ Lỗi:", err);
        Alert.alert("Lỗi", err?.message || "Không thể cập nhật phòng chiếu.");
        setSubmitting(false);
      }
    );
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

  if (!screen) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.text }}>Không tìm thấy phòng</Text>
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
            marginBottom: 20,
          }}
        >
          ✏️ Chỉnh Sửa Phòng Chiếu
        </Text>

        {/* Tên phòng */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{ color: COLORS.text, marginBottom: 6, fontWeight: "500" }}
          >
            Tên phòng *
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
              fontSize: 14,
            }}
            value={screen.name}
            onChangeText={(value) => handleChange("name", value)}
            placeholder="Ví dụ: Phòng 1, IMAX A..."
            placeholderTextColor={COLORS.placeholder}
          />
        </View>

        {/* Số hàng ghế */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{ color: COLORS.text, marginBottom: 6, fontWeight: "500" }}
          >
            Số hàng ghế (A, B, C...) *
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
              fontSize: 14,
            }}
            value={screen.rows.toString()}
            onChangeText={(value) => handleChange("rows", value)}
            placeholder="Ví dụ: 10, 12, 15..."
            placeholderTextColor={COLORS.placeholder}
            keyboardType="number-pad"
          />
          {screen.rows > 0 && (
            <Text
              style={{
                color: COLORS.placeholder,
                fontSize: 12,
                marginTop: 6,
                fontStyle: "italic",
              }}
            >
              Hàng: {getRowLabelsPreview(screen.rows)}
            </Text>
          )}
        </View>

        {/* Số cột ghế */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{ color: COLORS.text, marginBottom: 6, fontWeight: "500" }}
          >
            Số cột ghế *
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
              fontSize: 14,
            }}
            value={screen.cols.toString()}
            onChangeText={(value) => handleChange("cols", value)}
            placeholder="Ví dụ: 12, 15, 18..."
            placeholderTextColor={COLORS.placeholder}
            keyboardType="number-pad"
          />
        </View>

        {/* Info tính toán */}
        <View
          style={{
            backgroundColor: "#222",
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.primary,
          }}
        >
          <Text
            style={{ color: COLORS.placeholder, fontSize: 12, lineHeight: 18 }}
          >
            📌 Phòng này sẽ có {screen.rows} hàng (
            {getRowLabelsPreview(screen.rows)}) × {screen.cols} cột ={" "}
            <Text style={{ fontWeight: "bold", color: COLORS.primary }}>
              {screen.rows * screen.cols}
            </Text>{" "}
            ghế
          </Text>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={{
            backgroundColor: submitting ? COLORS.placeholder : COLORS.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {submitting ? "Đang cập nhật..." : "Cập Nhật Phòng"}
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
          }}
        >
          <Text style={{ color: COLORS.placeholder, fontSize: 15 }}>Huỷ</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
