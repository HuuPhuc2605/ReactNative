import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import DatePicker from "../../../components/admin/DatePicker";
import DropdownSelect from "../../../components/admin/DropdownSelect";
import NumberSpinner from "../../../components/admin/NumberSpinner";
import { addMovie, checkDuplicateTitle } from "../../../db/movie.repo";

// 🎨 Màu chủ đạo
const COLORS = {
  primary: "#E50914", // đỏ Netflix
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  success: "#2ecc71",
  danger: "#e74c3c",
};

const GENRES = [
  { label: "Hành động", value: "Hành động" },
  { label: "Phiêu lưu", value: "Phiêu lưu" },
  { label: "Hoạt hình", value: "Hoạt hình" },
  { label: "Hài", value: "Hài" },
  { label: "Tội phạm", value: "Tội phạm" },
  { label: "Tài liệu", value: "Tài liệu" },
  { label: "Chdrama", value: "Chrama" },
  { label: "Gia đình", value: "Gia đình" },
  { label: "Kỳ ảo", value: "Kỳ ảo" },
  { label: "Kinh dị", value: "Kinh dị" },
  { label: "Lịch sử", value: "Lịch sử" },
  { label: "Nhạc kịch", value: "Nhạc kịch" },
  { label: "Bí ẩn", value: "Bí ẩn" },
  { label: "Lãng mạn", value: "Lãng mạn" },
  { label: "Khoa học viễn tưởng", value: "Khoa học viễn tưởng" },
  { label: "Gây sốc", value: "Gây sốc" },
  { label: "Thể thao", value: "Thể thao" },
  { label: "Thriller", value: "Thriller" },
  { label: "Chiến tranh", value: "Chiến tranh" },
  { label: "Tây Bắc", value: "Tây Bắc" },
];

const LANGUAGES = [
  { label: "Tiếng Việt", value: "Tiếng Việt" },
  { label: "Tiếng Anh", value: "Tiếng Anh" },
  { label: "Tiếng Trung", value: "Tiếng Trung" },
  { label: "Tiếng Nhật", value: "Tiếng Nhật" },
  { label: "Tiếng Hàn", value: "Tiếng Hàn" },
];

export default function AddMovieScreen() {
  const router = useRouter();
  const [movie, setMovie] = useState({
    title: "",
    posterUrl: "",
    description: "",
    genre: "",
    duration: "100",
    language: "",
    director: "",
    cast: "",
    release_date: "",
    rating: "8",
  });

  const [customGenres, setCustomGenres] = useState([]);
  const [customLanguages, setCustomLanguages] = useState([]);

  const handleChange = (field, value) => {
    setMovie({ ...movie, [field]: value });
  };

  const handleSubmit = () => {
    if (!movie.title.trim() || !movie.duration) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên phim và thời lượng!");
      return;
    }

    if (isNaN(Number(movie.duration))) {
      Alert.alert("Lỗi dữ liệu", "Thời lượng phải là số!");
      return;
    }

    checkDuplicateTitle(movie.title, (isDuplicate) => {
      if (isDuplicate) {
        Alert.alert("Phim đã tồn tại", "Vui lòng nhập tên phim khác.");
        return;
      }

      addMovie(
        {
          ...movie,
          duration: Number(movie.duration),
          rating: Number(movie.rating) || 0,
        },
        () => {
          Alert.alert("✅ Thành công", "Đã thêm phim mới!");
          router.back();
        },
        (err) => {
          console.error(err);
          Alert.alert("❌ Lỗi", "Không thể thêm phim.");
        }
      );
    });
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
            marginBottom: 16,
          }}
        >
          🎬 Thêm phim mới
        </Text>

        {/* Tên phim */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>
            Tên phim *
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
            value={movie.title}
            onChangeText={(value) => handleChange("title", value)}
            placeholderTextColor={COLORS.placeholder}
            placeholder="Nhập tên phim"
          />
        </View>

        {/* Poster URL */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>
            Poster URL
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
            value={movie.posterUrl}
            onChangeText={(value) => handleChange("posterUrl", value)}
            placeholderTextColor={COLORS.placeholder}
            placeholder="https://..."
          />
        </View>

        {/* Mô tả */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>Mô tả</Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
              height: 80,
              textAlignVertical: "top",
            }}
            value={movie.description}
            onChangeText={(value) => handleChange("description", value)}
            placeholderTextColor={COLORS.placeholder}
            placeholder="Nhập mô tả phim"
            multiline
          />
        </View>

        {/* Thể loại */}
        <DropdownSelect
          label="Thể loại"
          value={movie.genre}
          onChangeValue={(value) => handleChange("genre", value)}
          options={[
            ...GENRES,
            ...customGenres.map((g) => ({ label: g, value: g })),
          ]}
          onAddCustom={(value) => setCustomGenres([...customGenres, value])}
        />

        {/* Thời lượng */}
        <NumberSpinner
          label="Thời lượng (phút) *"
          value={movie.duration}
          onChangeValue={(value) => handleChange("duration", value)}
          min={0}
          max={300}
          step={5}
        />

        {/* Ngôn ngữ */}
        <DropdownSelect
          label="Ngôn ngữ"
          value={movie.language}
          onChangeValue={(value) => handleChange("language", value)}
          options={[
            ...LANGUAGES,
            ...customLanguages.map((l) => ({ label: l, value: l })),
          ]}
          onAddCustom={(value) =>
            setCustomLanguages([...customLanguages, value])
          }
        />

        {/* Đạo diễn */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>Đạo diễn</Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
            }}
            value={movie.director}
            onChangeText={(value) => handleChange("director", value)}
            placeholderTextColor={COLORS.placeholder}
            placeholder="Nhập tên đạo diễn"
          />
        </View>

        {/* Diễn viên */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, marginBottom: 6 }}>Diễn viên</Text>
          <TextInput
            style={{
              backgroundColor: COLORS.card,
              color: COLORS.text,
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: COLORS.placeholder,
            }}
            value={movie.cast}
            onChangeText={(value) => handleChange("cast", value)}
            placeholderTextColor={COLORS.placeholder}
            placeholder="Nhập tên diễn viên"
          />
        </View>

        {/* Ngày khởi chiếu */}
        <DatePicker
          label="Ngày khởi chiếu"
          value={movie.release_date}
          onChangeValue={(value) => handleChange("release_date", value)}
        />

        {/* Điểm đánh giá */}
        <NumberSpinner
          label="Điểm đánh giá (0–10)"
          value={movie.rating}
          onChangeValue={(value) => handleChange("rating", value)}
          min={0}
          max={10}
          step={0.5}
        />

        {/* Nút lưu */}
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
            Lưu phim
          </Text>
        </Pressable>

        {/* Nút hủy */}
        <Pressable
          onPress={() => router.goBack()}
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
