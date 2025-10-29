import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { addToCart } from "../src/db/cart.repo";
import { getAllProducts, initProducts } from "../src/db/product.repo";
import { Product, formatCurrency } from "../src/models/types";

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<"asc" | "desc" | "">("");
  const router = useRouter();

  const load = async () => {
    await initProducts();
    let data = await getAllProducts();

    // Lọc theo từ khóa
    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Lọc theo giá
    if (priceFilter === "asc") data.sort((a, b) => a.price - b.price);
    if (priceFilter === "desc") data.sort((a, b) => b.price - a.price);

    setProducts(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      load(); // gọi async function load() nhưng không return Promise
    }, [search, priceFilter])
  );

  const handleAdd = async (id: number) => {
    try {
      await addToCart(id);
      Toast.show({ type: "success", text1: "Đã thêm vào giỏ hàng!" });
      load();
    } catch (e: any) {
      Toast.show({ type: "error", text1: e.message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sản phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Tìm sản phẩm..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setPriceFilter("asc")}
          style={[
            styles.filterBtn,
            priceFilter === "asc" && styles.filterBtnActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              priceFilter === "asc" && styles.filterTextActive,
            ]}
          >
            Giá tăng dần
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPriceFilter("desc")}
          style={[
            styles.filterBtn,
            priceFilter === "desc" && styles.filterBtnActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              priceFilter === "desc" && styles.filterTextActive,
            ]}
          >
            Giá giảm dần
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setPriceFilter("");
            setSearch("");
          }}
          style={styles.filterBtn}
        >
          <Text style={styles.filterText}>Reset</Text>
        </Pressable>
      </View>

      <FlatList
        data={products}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Giá: {formatCurrency(item.price)}</Text>
            <Text>Tồn kho: {item.stock}</Text>
            <Button title="THÊM" onPress={() => handleAdd(item.id)} />
          </View>
        )}
      />

      <Button title="🛒 Xem giỏ hàng" onPress={() => router.push("/cart")} />
      <Toast position="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  filterBtn: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: "#007bff",
  },
  filterText: {
    color: "#333",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: { flex: 1, padding: 14, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f7fbff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  name: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});
