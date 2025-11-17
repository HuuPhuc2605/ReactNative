"use client";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { getShowtimeById, updateShowtime } from "../../../db/showtime.repo";
import { getScreensByTheater, getTheaters } from "../../../db/theater.repo";
import type { Movie, Screen, Showtime, Theater } from "../../../types/types";

export default function EditShowtimeScreen({ id: propsId }: { id?: string }) {
  const { id: paramsId } = useLocalSearchParams();
  const id = propsId || paramsId;
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = () => {
    const stringShowId = String(id);

    console.log("[v0] Loading showtime with ID:", {
      originalId: id,
      stringId: stringShowId,
    });

    getShowtimeById(
      stringShowId,
      (data: Showtime) => {
        console.log("[v0] Loaded showtime data:", data);
        setShowtime(data);
        loadMovies();
        loadTheaters();
        if (data.screen_id) {
          setSelectedTheater({ id: data.screen_id } as Theater);
        }
        if (data.screen_id) {
          getScreensByTheater(
            data.screen_id || 0,
            (screens: Screen[]) => {
              setScreens(screens);
              setLoading(false);
            },
            (error: any) => {
              console.error("[v0] Error loading screens:", error);
              Alert.alert("Lỗi", "Không thể tải phòng chiếu");
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      },
      (error: any) => {
        console.error("[v0] Error loading showtime:", error);
        Alert.alert("Lỗi", error?.message || "Không thể tải suất chiếu");
        setLoading(false);
      }
    );
  };

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
        const firstScreenId = data.length > 0 ? data[0].id : undefined;
        if (firstScreenId) {
          setShowtime({ ...showtime, screen_id: firstScreenId } as Showtime);
        }
      },
      (error: any) => Alert.alert("Lỗi", "Không thể tải danh sách phòng")
    );
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (
      !showtime ||
      !showtime.movie_id ||
      !showtime.screen_id ||
      !showtime.price
    ) {
      Alert.alert("Lỗi", "Vui lòng điền tất cả thông tin");
      return;
    }

    if (
      isNaN(Number(showtime.price)) ||
      Number.parseFloat(showtime.price.toString()) < 0
    ) {
      Alert.alert("Lỗi", "Giá vé không hợp lệ");
      return;
    }

    setSaving(true);
    updateShowtime(
      {
        ...showtime,
        price: Number.parseFloat(showtime.price.toString()),
      },
      () => {
        setSaving(false);
        Alert.alert("Thành công", "Đã cập nhật suất chiếu", [
          { text: "OK", onPress: () => router.back() },
        ]);
      },
      (error: any) => {
        setSaving(false);
        Alert.alert("Lỗi", error?.message);
      }
    );
  };

  if (loading || !showtime) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Đang tải...</Text>
      </View>
    );
  }

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
            {selectedTheater
              ? selectedTheater.name || "Chọn rạp..."
              : "Chọn rạp..."}
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

      {showtime && (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Ngày chiếu</Text>
            <DatePicker
              label=""
              value={showtime.start_time.split("T")[0] || ""}
              onChangeValue={(dateValue: any) => {
                const time = showtime.start_time.split("T")[1] || "00:00";
                setShowtime({
                  ...showtime,
                  start_time: `${dateValue}T${time}`,
                });
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
                setShowtime({
                  ...showtime,
                  start_time: `${date}T${timeValue}`,
                });
              }}
            />
          </View>
        </>
      )}

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
        style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.submitBtnText}>
          {saving ? "Đang cập nhật..." : "Cập nhật suất chiếu"}
        </Text>
      </TouchableOpacity>

      {/* ... Modals ... */}
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
  loading: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
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
