"use client";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { getMovieById, updateMovie } from "../../../db/movie.repo";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  success: "#2ecc71",
  danger: "#e74c3c",
};

export default function EditMovieScreen() {
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    posterUrl: "",
    description: "",
    genre: "",
    duration: "",
    language: "",
    director: "",
    cast: "",
    release_date: "",
    rating: "",
  });

  useEffect(() => {
    console.log("🎬 Nhận movieId:", movieId, "Type:", typeof movieId);
    if (!movieId) {
      setLoading(false);
      return;
    }

    // Use ID as-is (string format)
    const stringMovieId = String(movieId);

    getMovieById(
      stringMovieId,
      (data) => {
        console.log("✅ Dữ liệu phim:", data);
        setMovie({
          ...data,
          id: stringMovieId,
          duration: String(data.duration || ""),
          rating: String(data.rating || ""),
        });
        setLoading(false);
      },
      (err) => {
        console.error("❌ Lỗi lấy phim:", err);
        Alert.alert("❌ Lỗi", `Không thể tải phim: ${err?.message || err}`);
        setLoading(false);
      }
    );
  }, [movieId]);

  const handleChange = (field, value) => {
    setMovie({ ...movie, [field]: value });
  };

  const handleUpdate = async () => {
    if (!movie.title.trim() || !movie.duration.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên phim và thời lượng!");
      return;
    }

    if (isNaN(Number(movie.duration))) {
      Alert.alert("Lỗi dữ liệu", "Thời lượng phải là số!");
      return;
    }

    try {
      await updateMovie(
        {
          ...movie,
          duration: Number(movie.duration),
          rating: Number(movie.rating) || 0,
        },
        () => {
          Alert.alert("✅ Thành công", "Đã cập nhật thông tin phim!");
          router.back();
        },
        (err) => {
          console.error("❌ Lỗi khi cập nhật phim:", err);
          const errorMsg =
            err?.message || JSON.stringify(err) || "Lỗi không xác định";
          Alert.alert("❌ Cập nhật thất bại", errorMsg);
        }
      );
    } catch (err) {
      console.error("❌ Exception:", err);
      Alert.alert("❌ Lỗi", `Lỗi không mong muốn: ${err?.message || err}`);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.text, marginTop: 10 }}>
          Đang tải thông tin phim...
        </Text>
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
          ✏️ Cập nhật phim
        </Text>

        {[
          { label: "Tên phim *", field: "title" },
          { label: "Poster URL", field: "posterUrl" },
          { label: "Mô tả", field: "description" },
          { label: "Thể loại", field: "genre" },
          {
            label: "Thời lượng (phút) *",
            field: "duration",
            keyboardType: "numeric",
          },
          { label: "Ngôn ngữ", field: "language" },
          { label: "Đạo diễn", field: "director" },
          { label: "Diễn viên", field: "cast" },
          { label: "Ngày khởi chiếu (YYYY-MM-DD)", field: "release_date" },
          {
            label: "Điểm đánh giá (0–10)",
            field: "rating",
            keyboardType: "numeric",
          },
        ].map((item, index) => (
          <View key={index} style={{ marginBottom: 14 }}>
            <Text style={{ color: COLORS.text, marginBottom: 6 }}>
              {item.label}
            </Text>
            <TextInput
              style={{
                backgroundColor: COLORS.card,
                color: COLORS.text,
                borderRadius: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: COLORS.placeholder,
              }}
              value={movie[item.field]}
              onChangeText={(value) => handleChange(item.field, value)}
              keyboardType={item.keyboardType || "default"}
              placeholderTextColor={COLORS.placeholder}
              placeholder={`Nhập ${item.label.toLowerCase()}`}
            />
          </View>
        ))}

        <Pressable
          onPress={handleUpdate}
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
            Cập nhật phim
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
