import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initProducts } from "../src/db/product.repo";

export default function Layout() {
  useEffect(() => {
    initProducts();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0080ff" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Sản phẩm" }} />
        <Stack.Screen name="cart" options={{ title: "Giỏ hàng" }} />
        <Stack.Screen name="invoice" options={{ title: "Hóa đơn" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
