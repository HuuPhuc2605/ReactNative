import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DropdownSelect({
  value,
  onChangeValue,
  options = [],
  label,
  placeholder = "Chọn...",
  onAddCustom = null,
}) {
  const [visible, setVisible] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    onChangeValue(val);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.selectBtn}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.selectBtnText}>
          {selectedOption?.label || value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Chọn"}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons name="checkmark" size={20} color="#E50914" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {onAddCustom && (
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>
                  Hoặc nhập giá trị khác
                </Text>
                <View style={styles.customInputWrapper}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="Nhập..."
                    placeholderTextColor="#666"
                    value={customInput}
                    onChangeText={setCustomInput}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (customInput.trim()) {
                        onChangeValue(customInput);
                        onAddCustom(customInput);
                        setCustomInput("");
                        setVisible(false);
                      }
                    }}
                    style={styles.addCustomBtn}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 14,
  },
  selectBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  selectBtnText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
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
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsList: {
    maxHeight: "60%",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  optionText: {
    color: "#ccc",
    fontSize: 16,
    flex: 1,
  },
  optionTextSelected: {
    color: "#E50914",
    fontWeight: "bold",
  },
  customInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    padding: 16,
  },
  customInputLabel: {
    color: "#999",
    fontSize: 12,
    marginBottom: 8,
  },
  customInputWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#444",
  },
  addCustomBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
