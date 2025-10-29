import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { deleteItem, getCartItems, updateQty } from "../src/db/cart.repo";
import { CartItem, formatCurrency } from "../src/models/types";

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const load = async () => {
    const data = await getCartItems();
    setItems(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const increase = async (pid: number) => {
    const item = items.find((i) => i.product_id === pid);
    if (!item) return;
    try {
      await updateQty(pid, item.qty + 1);
      await load();
    } catch (e: any) {
      Alert.alert("⚠️ Lỗi", e.message);
    }
  };

  const decrease = async (pid: number) => {
    const item = items.find((i) => i.product_id === pid);
    if (!item) return;
    await updateQty(pid, item.qty - 1);
    await load();
  };

  const remove = async (pid: number) => {
    await deleteItem(pid);
    await load();
  };

  const total = items.reduce((s, i) => s + i.line_total, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Giá: {formatCurrency(item.unit_price)}</Text>
              <Text>Số lượng: {item.qty}</Text>
              <Text>Thành tiền: {formatCurrency(item.line_total)}</Text>
            </View>
            <View style={styles.actions}>
              <Button title="＋" onPress={() => increase(item.product_id)} />
              <Button title="－" onPress={() => decrease(item.product_id)} />
              <Button title="xóa" onPress={() => remove(item.product_id)} />
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Tổng cộng: {formatCurrency(total)}</Text>
        <Button title="Xem hóa đơn" onPress={() => router.push("/invoice")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  row: {
    flexDirection: "row",
    backgroundColor: "#f2f7ff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  name: { fontWeight: "bold", fontSize: 16 },
  actions: { justifyContent: "space-around", gap: 10 },
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  total: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
});
