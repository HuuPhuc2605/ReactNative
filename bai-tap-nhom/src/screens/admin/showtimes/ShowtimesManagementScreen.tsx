"use client";

import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  cancelShowtime,
  deleteShowtime,
  getShowtimes,
} from "../../../db/showtime.repo";
import type { ShowtimeWithDetails } from "../../../types/types";

export default function ShowtimesManagementScreen() {
  const [showtimes, setShowtimes] = useState<ShowtimeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "past" | "future">(
    "all"
  );
  const router = useRouter();

  useEffect(() => {
    loadShowtimes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadShowtimes();
    }, [])
  );

  const loadShowtimes = () => {
    setLoading(true);
    getShowtimes(
      (data: ShowtimeWithDetails[]) => {
        setShowtimes(data);
        setLoading(false);
      },
      (error: any) => {
        Alert.alert("Lỗi", error?.message || "Không thể tải suất chiếu");
        setLoading(false);
      }
    );
  };

  const getFilteredShowtimes = () => {
    const now = new Date();

    return showtimes.filter((item) => {
      if (!item.start_time) return false;

      const showTime = new Date(item.start_time);

      if (filterType === "past") {
        return showTime < now;
      } else if (filterType === "future") {
        return showTime >= now;
      }
      return true;
    });
  };

  const handleDelete = (id: number | undefined) => {
    if (!id) return;
    Alert.alert("Xác nhận", "Bạn chắc chắn muốn xóa suất chiếu này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          deleteShowtime(
            id,
            () => {
              loadShowtimes();
              Alert.alert("Thành công", "Đã xóa suất chiếu");
            },
            (error: any) => {
              const errorMsg = error?.message || "Lỗi khi xóa suất chiếu";
              Alert.alert("Lỗi xóa suất chiếu", errorMsg);
            }
          );
        },
      },
    ]);
  };

  const handleCancel = (id: number | undefined) => {
    if (!id) return;
    Alert.alert("Xác nhận", "Bạn chắc chắn muốn hủy suất chiếu này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy suất chiếu",
        style: "destructive",
        onPress: () => {
          cancelShowtime(
            id,
            () => {
              loadShowtimes();
              Alert.alert("Thành công", "Đã hủy suất chiếu");
            },
            (error: any) => {
              const errorMsg = error?.message || "Lỗi khi hủy suất chiếu";
              Alert.alert("Lỗi hủy suất chiếu", errorMsg);
            }
          );
        },
      },
    ]);
  };

  const handleEdit = (id: number | undefined) => {
    if (!id) return;
    router.push(`/admin/showtimes/edit/${id}`);
  };

  const handleAdd = () => {
    router.push("/admin/showtimes/add");
  };

  const renderItem = ({ item }: { item: ShowtimeWithDetails }) => {
    if (!item.id) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.movie_title}</Text>
          <Text style={styles.subtitle}>
            {item.screen_name} - {item.theater_name}
          </Text>
          <Text style={styles.info}>
            {item.start_time
              ? new Date(item.start_time).toLocaleString("vi-VN")
              : "N/A"}
          </Text>
          <Text style={styles.price}>
            Giá: {item.price?.toLocaleString("vi-VN")} đ
          </Text>
          <Text
            style={[
              styles.status,
              item.status === "active" ? styles.active : styles.cancelled,
            ]}
          >
            {item.status === "active" ? "Hoạt động" : "Đã hủy"}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleEdit(item.id)}
            style={styles.editBtn}
          >
            <AntDesign name="edit" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCancel(item.id)}
            style={styles.cancelBtn}
          >
            <AntDesign name="close" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteBtn}
          >
            <AntDesign name="delete" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredShowtimes = getFilteredShowtimes();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Quản lý suất chiếu</Text>
        <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === "all" && styles.filterBtnActive,
          ]}
          onPress={() => setFilterType("all")}
        >
          <Text
            style={[
              styles.filterBtnText,
              filterType === "all" && styles.filterBtnTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === "past" && styles.filterBtnActive,
          ]}
          onPress={() => setFilterType("past")}
        >
          <Text
            style={[
              styles.filterBtnText,
              filterType === "past" && styles.filterBtnTextActive,
            ]}
          >
            Đã qua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === "future" && styles.filterBtnActive,
          ]}
          onPress={() => setFilterType("future")}
        >
          <Text
            style={[
              styles.filterBtnText,
              filterType === "future" && styles.filterBtnTextActive,
            ]}
          >
            Sắp tới
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : filteredShowtimes.length === 0 ? (
        <Text style={styles.emptyText}>
          {filterType === "past"
            ? "Không có suất chiếu đã qua"
            : filterType === "future"
            ? "Không có suất chiếu sắp tới"
            : "Không có suất chiếu nào"}
        </Text>
      ) : (
        <FlatList
          data={filteredShowtimes}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#444",
  },
  filterBtnActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterBtnText: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  filterBtnTextActive: {
    color: "white",
  },
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  info: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  status: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelled: {
    color: "#ff5252",
  },
  active: {
    color: "#4CAF50",
  },
  actions: {
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: 8,
  },
  editBtn: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  cancelBtn: {
    backgroundColor: "#FF9800",
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
