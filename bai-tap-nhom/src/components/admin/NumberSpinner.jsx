import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NumberSpinner({
  value,
  onChangeValue,
  min = 0,
  max = 999999,
  step = 1,
  label,
}) {
  const handleIncrease = () => {
    const newValue = Math.min(Number(value) + step, max);
    onChangeValue(newValue.toString());
  };

  const handleDecrease = () => {
    const newValue = Math.max(Number(value) - step, min);
    onChangeValue(newValue.toString());
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.spinner}>
        <TouchableOpacity onPress={handleDecrease} style={styles.btn}>
          <Ionicons name="remove" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.value}>{value || "0"}</Text>

        <TouchableOpacity onPress={handleIncrease} style={styles.btn}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
  spinner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    paddingHorizontal: 12,
  },
  btn: {
    padding: 10,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});
