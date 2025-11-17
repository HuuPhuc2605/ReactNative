"use client";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "../../../components/admin/DatePicker";
import NumberSpinner from "../../../components/admin/NumberSpinner";
import TimePicker from "../../../components/admin/TimePicker";
import { getMovies } from "../../../db/movie.repo";
import { addShowtime } from "../../../db/showtime.repo";
import { getScreensByTheater, getTheaters } from "../../../db/theater.repo";
import type { Movie, Screen, Theater } from "../../../types/types";

export default function AddShowtimeScreen() {
  const [showtime, setShowtime] = useState({
    movie_id: null as number | null,
    screen_id: null as number | null,
    start_time: new Date().toISOString().slice(0, 16),
    price: 0,
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "movie", "theater", "screen"
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadMovies();
    loadTheaters();
  }, []);

  const loadMovies = () => {
    getMovies(
      {},
      (data: Movie[]) => setMovies(data),
      (error: any) => Alert.alert("Lỗi", "Không thể tải danh sách phim")
    );
  };

  const loadTheaters = () => {
    getTheaters(
      (data: Theater[]) => setTheaters(data),
      (error: any) => Alert.alert("Lỗi", "Không thể tải danh sách rạp")
    );
  };

  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
    getScreensByTheater(
      theater.id || 0,
      (data: Screen[]) => {
        setScreens(data);
        setShowtime({ ...showtime, screen_id: null });
      },
      (error: any) => Alert.alert("Lỗi", "Không thể tải danh sách phòng")
    );
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!showtime.movie_id || !showtime.screen_id || showtime.price <= 0) {
      Alert.alert("Lỗi", "Vui lòng điền tất cả thông tin");
      return;
    }

    setLoading(true);
    console.log("[v0] Adding showtime with data:", {
      ...showtime,
      price: showtime.price,
      movie_id: showtime.movie_id || 0,
      screen_id: showtime.screen_id || 0,
    });

    addShowtime(
      {
        ...showtime,
        price: showtime.price,
        movie_id: showtime.movie_id || 0,
        screen_id: showtime.screen_id || 0,
      },
      () => {
        setLoading(false);
        Alert.alert("Thành công", "Đã thêm suất chiếu", [
          { text: "OK", onPress: () => router.back() },
        ]);
      },
      (error: any) => {
        setLoading(false);
        console.error("[v0] Error details:", error);
        Alert.alert("Lỗi", error?.message || "Không thể thêm suất chiếu");
      }
    );
  };

  const selectedMovie = movies.find((m) => m.id === showtime.movie_id);
  const selectedScreen = screens.find((s) => s.id === showtime.screen_id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Chọn phim</Text>
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => {
            setModalType("movie");
            setModalVisible(true);
          }}
        >
          <Text style={styles.selectBtnText}>
            {selectedMovie ? selectedMovie.title : "Chọn phim..."}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Chọn rạp</Text>
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => {
            setModalType("theater");
            setModalVisible(true);
          }}
        >
          <Text style={styles.selectBtnText}>
            {selectedTheater ? selectedTheater.name : "Chọn rạp..."}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {selectedTheater && (
        <View style={styles.section}>
          <Text style={styles.label}>Chọn phòng chiếu</Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => {
              setModalType("screen");
              setModalVisible(true);
            }}
          >
            <Text style={styles.selectBtnText}>
              {selectedScreen ? selectedScreen.name : "Chọn phòng..."}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Ngày chiếu</Text>
        <DatePicker
          label=""
          value={showtime.start_time.split("T")[0] || ""}
          onChangeValue={(dateValue: any) => {
            const time = showtime.start_time.split("T")[1] || "00:00";
            setShowtime({ ...showtime, start_time: `${dateValue}T${time}` });
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Giờ chiếu</Text>
        <TimePicker
          label=""
          value={showtime.start_time}
          onChangeValue={(timeValue: any) => {
            const date =
              showtime.start_time.split("T")[0] ||
              new Date().toISOString().split("T")[0];
            setShowtime({ ...showtime, start_time: `${date}T${timeValue}` });
          }}
        />
      </View>

      <View style={styles.section}>
        <NumberSpinner
          label="Giá vé (đ)"
          value={showtime.price?.toString() || "0"}
          onChangeValue={(value: any) =>
            setShowtime({ ...showtime, price: Number(value) })
          }
          min={0}
          max={500000}
          step={5000}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitBtnText}>
          {loading ? "Đang thêm..." : "Thêm suất chiếu"}
        </Text>
      </TouchableOpacity>

      {/* Modal chọn phim */}
      <Modal visible={modalVisible && modalType === "movie"} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phim</Text>
            <FlatList<Movie>
              data={movies}
              renderItem={({ item }: { item: Movie }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setShowtime({ ...showtime, movie_id: item.id || 0 });
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item: Movie) => (item.id || 0).toString()}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal chọn rạp */}
      <Modal visible={modalVisible && modalType === "theater"} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn rạp</Text>
            <FlatList<Theater>
              data={theaters}
              renderItem={({ item }: { item: Theater }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleTheaterSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemSubtext}>{item.location}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item: Theater) => (item.id || 0).toString()}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal chọn phòng chiếu */}
      <Modal visible={modalVisible && modalType === "screen"} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phòng chiếu</Text>
            <FlatList<Screen>
              data={screens}
              renderItem={({ item }: { item: Screen }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setShowtime({ ...showtime, screen_id: item.id || 0 });
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item: Screen) => (item.id || 0).toString()}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  selectBtnText: {
    color: "#fff",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#444",
    color: "white",
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
    paddingTop: 16,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalItemText: {
    color: "white",
    fontSize: 16,
  },
  modalItemSubtext: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  closeBtn: {
    backgroundColor: "#f44336",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  hint: {
    color: "#999",
    fontSize: 12,
    marginBottom: 6,
  },
});
