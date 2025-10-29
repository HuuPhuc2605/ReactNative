import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { checkout, getInvoiceItems } from "../src/db/cart.repo";
import { CartItem, formatCurrency } from "../src/models/types";

export default function InvoiceScreen() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [date, setDate] = useState<string>("");
  const router = useRouter();

  const load = async () => {
    const data = await getInvoiceItems();
    setItems(data);

    // Lấy ngày giờ hiện tại (VN)
    const now = new Date();
    const formatted = now.toLocaleString("vi-VN", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
    setDate(formatted);
  };

  useEffect(() => {
    load();
  }, []);

  const total = items.reduce((s, i) => s + i.line_total, 0);
  const vat = total * 0.1;
  const grand = total + vat;

  const handleCheckout = async () => {
    if (items.length === 0) {
      Toast.show({ type: "info", text1: "Giỏ hàng trống!" });
      return;
    }

    await checkout();
    Toast.show({ type: "success", text1: "Thanh toán thành công!" });
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hóa đơn thanh toán</Text>

      <View style={styles.header}>
        <Text style={styles.label}>Ngày giờ:</Text>
        <Text style={styles.value}>{date}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginVertical: 10 }}>
            Chưa có sản phẩm nào trong hóa đơn
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>SL: {item.qty}</Text>
              <Text>Đơn giá: {formatCurrency(item.unit_price)}</Text>
              <Text style={styles.lineTotal}>
                Thành tiền: {formatCurrency(item.line_total)}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Tạm tính: {formatCurrency(total)}
        </Text>
        <Text style={styles.summaryText}>VAT (10%): {formatCurrency(vat)}</Text>
        <Text style={styles.total}>Tổng cộng: {formatCurrency(grand)}</Text>
      </View>

      <Button title="Thanh toán" onPress={handleCheckout} />
      <Toast position="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f7ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: { fontWeight: "bold", color: "#333" },
  value: { color: "#555" },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  name: { fontWeight: "bold", fontSize: 16, color: "#333" },
  lineTotal: { fontWeight: "600", marginTop: 4, color: "#007bff" },
  summary: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 12,
    paddingTop: 8,
    backgroundColor: "#f9fbff",
    borderRadius: 6,
  },
  summaryText: { fontSize: 15, marginBottom: 3 },
  total: { fontWeight: "bold", fontSize: 18, marginTop: 4, color: "#007bff" },
});
