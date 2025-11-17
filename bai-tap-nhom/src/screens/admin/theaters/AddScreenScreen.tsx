"use client";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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
import { addScreen } from "../../../db/theater.repo";
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

export default function AddScreenScreen() {
  const router = useRouter();
  const { theaterId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [rows, setRows] = useState("10");
  const [cols, setCols] = useState("15");
  const [loading, setLoading] = useState(false);

  const getRowLabelsPreview = () => {
    const rowNum = Number.parseInt(rows) || 0;
    if (rowNum < 1 || rowNum > 26) return "";
    const labels = generateRowLabels(rowNum);
    return labels.slice(0, 3).join(", ") + (rowNum > 3 ? ", ..." : "");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên phòng!");
      return;
    }

    if (!theaterId) {
      Alert.alert(
        "Lỗi",
        "Không tìm thấy ID rạp. Vui lòng quay lại và thử lại."
      );
      return;
    }

    const rowNum = Number.parseInt(rows);
    const colNum = Number.parseInt(cols);

    if (!rowNum || !colNum || rowNum < 1 || colNum < 1) {
      Alert.alert("Lỗi", "Số hàng và cột phải >= 1");
      return;
    }

    setLoading(true);
    const stringTheaterId = String(theaterId);

    addScreen(
      {
        theater_id: stringTheaterId,
        name: name.trim(),
        rows: rowNum,
        cols: colNum,
      },
      () => {
        Alert.alert("✅ Thành công", "Đã thêm phòng chiếu mới!");
        router.back();
      },
      (err: Error) => {
        console.error("❌ Lỗi:", err);
        const errorMsg =
          err?.message || JSON.stringify(err) || "Không thể thêm phòng chiếu";
        Alert.alert("❌ Lỗi thêm phòng", errorMsg);
        setLoading(false);
      }
    );
  };

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
          🎬 Thêm Phòng Chiếu Mới
        </Text>

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
            value={name}
            onChangeText={setName}
            placeholder="Ví dụ: Phòng 1, IMAX A, Dolby Atmos..."
            placeholderTextColor={COLORS.placeholder}
          />
        </View>

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
            value={rows}
            onChangeText={setRows}
            placeholder="Ví dụ: 10, 12, 15..."
            placeholderTextColor={COLORS.placeholder}
            keyboardType="number-pad"
          />
          {rows && (
            <Text
              style={{
                color: COLORS.placeholder,
                fontSize: 12,
                marginTop: 6,
                fontStyle: "italic",
              }}
            >
              Hàng: {getRowLabelsPreview()}
            </Text>
          )}
        </View>

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
            value={cols}
            onChangeText={setCols}
            placeholder="Ví dụ: 12, 15, 18..."
            placeholderTextColor={COLORS.placeholder}
            keyboardType="number-pad"
          />
        </View>

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
            📌 Phòng này sẽ có {rows} hàng ({getRowLabelsPreview()}) × {cols}{" "}
            cột ={" "}
            <Text style={{ fontWeight: "bold", color: COLORS.primary }}>
              {Number.parseInt(rows) * Number.parseInt(cols) || 0}
            </Text>{" "}
            ghế
          </Text>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? COLORS.placeholder : COLORS.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {loading ? "Đang lưu..." : "Lưu Phòng"}
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
