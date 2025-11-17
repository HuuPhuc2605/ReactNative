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

const DatePicker = ({ label, value, onChangeValue }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    value ? new Date(value).getFullYear() : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    value ? new Date(value).getMonth() + 1 : new Date().getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState(
    value ? new Date(value).getDate() : new Date().getDate()
  );

  const handleConfirm = () => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-${String(selectedDay).padStart(2, "0")}`;
    onChangeValue(dateStr);
    setModalVisible(false);
  };

  const displayDate = value || "Chọn ngày";

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Generate day options
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{displayDate}</Text>
        <Ionicons name="calendar" size={20} color="#E50914" />
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngày</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.pickerContainer}>
              {/* Năm */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Năm</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <Pressable
                      key={year}
                      style={[
                        styles.option,
                        selectedYear === year && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedYear === year && styles.selectedOptionText,
                        ]}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Tháng */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Tháng</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {months.map((month, idx) => (
                    <Pressable
                      key={idx}
                      style={[
                        styles.option,
                        selectedMonth === idx + 1 && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedMonth(idx + 1)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedMonth === idx + 1 &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {month}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Ngày */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Ngày</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <Pressable
                      key={day}
                      style={[
                        styles.option,
                        selectedDay === day && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedDay === day && styles.selectedOptionText,
                        ]}
                      >
                        {day}
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

export default DatePicker;
