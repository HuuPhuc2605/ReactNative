import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { deleteMovie, getMovies } from "../../../db/movie.repo";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  danger: "#e74c3c",
  gray: "#555",
};

export default function MoviesManagementScreen() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // 📌 Load danh sách phim
  const loadMovies = () => {
    getMovies({ search }, (data) => setMovies(data));
  };

  // Gọi lại mỗi khi quay lại trang
  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [search])
  );

  const handleDelete = (id) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa phim này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () =>
          deleteMovie(
            id,
            () => {
              Alert.alert("🗑️", "Đã xóa phim thành công!");
              loadMovies();
            },
            (err) => {
              console.error("[v0] Delete error:", err);
              const errorMsg =
                err?.message || err?.toString?.() || "Không thể xóa phim.";
              Alert.alert("❌ Lỗi xóa phim", errorMsg);
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
          style={{
            color: COLORS.primary,
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          🎬 Quản lý phim
        </Text>

        <Pressable
          onPress={() => router.push("/admin/movies/add-movie")}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 4 }}>Thêm</Text>
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
          placeholder="Tìm kiếm phim..."
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

      {/* List */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadMovies();
              setTimeout(() => setRefreshing(false), 600);
            }}
          />
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.card,
              borderRadius: 12,
              padding: 10,
              marginBottom: 10,
              alignItems: "center",
              elevation: 2,
            }}
          >
            {/* Poster */}
            {item.posterUrl ? (
              <Image
                source={{ uri: item.posterUrl }}
                style={{
                  width: 60,
                  height: 90,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 90,
                  borderRadius: 8,
                  marginRight: 12,
                  backgroundColor: COLORS.gray,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="image-outline" size={24} color="#ccc" />
              </View>
            )}

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: COLORS.text, fontSize: 16, fontWeight: "bold" }}
              >
                {item.title}
              </Text>
              <Text style={{ color: COLORS.placeholder, fontSize: 13 }}>
                🎭 {item.genre || "Chưa rõ"} | ⏱ {item.duration} phút
              </Text>
              <Text style={{ color: COLORS.placeholder, fontSize: 13 }}>
                ⭐ {item.rating || 0}/10
              </Text>
            </View>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Edit */}
              <Pressable
                onPress={() => router.push(`/admin/movies/edit/${item.id}`)}
              >
                <Ionicons name="create-outline" size={22} color="#fff" />
              </Pressable>

              {/* Delete */}
              <Pressable onPress={() => handleDelete(item.id)}>
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={COLORS.danger}
                />
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
            Không có phim nào được tìm thấy.
          </Text>
        )}
      />
    </View>
  );
}
