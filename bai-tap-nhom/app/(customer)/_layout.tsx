"use client";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerGroupLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="black" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movie-detail"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "Chi tiết phim",
          }}
        />
        <Stack.Screen
          name="booking/index"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "Đặt vé",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
