import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TimePicker = ({ label, value, onChangeValue }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    value ? parseInt(value.split("T")[1]?.split(":")[0] || "00") : 0
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? parseInt(value.split("T")[1]?.split(":")[1] || "00") : 0
  );

  const handleConfirm = () => {
    const timeStr = `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;
    onChangeValue(timeStr);
    setModalVisible(false);
  };

  const displayTime = value ? value.split("T")[1] || "Chọn giờ" : "Chọn giờ";

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{displayTime}</Text>
        <Ionicons name="time" size={20} color="#E50914" />
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn giờ</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.pickerContainer}>
              {/* Giờ */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Giờ</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {hours.map((hour) => (
                    <Pressable
                      key={hour}
                      style={[
                        styles.option,
                        selectedHour === hour && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedHour === hour && styles.selectedOptionText,
                        ]}
                      >
                        {String(hour).padStart(2, "0")}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Phút */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Phút</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {minutes.map((minute) => (
                    <Pressable
                      key={minute}
                      style={[
                        styles.option,
                        selectedMinute === minute && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedMinute === minute &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {String(minute).padStart(2, "0")}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Chọn</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1c1c1c",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#888",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    color: "#fff",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerContainer: {
    flexDirection: "row",
    height: 200,
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  columnLabel: {
    color: "#E50914",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 12,
  },
  option: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#E50914",
  },
  optionText: {
    color: "#999",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#E50914",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TimePicker;
