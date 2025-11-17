"use client";

import { Stack } from "expo-router";

export default function MoviesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0f0f0f" },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Quản lý phim",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="add-movie"
        options={{
          title: "Thêm phim mới",
          headerBackTitle: "Quay lại",
        }}
      />
      <Stack.Screen
        name="edit/[movieId]"
        options={{
          title: "Sửa phim",
          headerBackTitle: "Quay lại",
        }}
      />
    </Stack>
  );
}
