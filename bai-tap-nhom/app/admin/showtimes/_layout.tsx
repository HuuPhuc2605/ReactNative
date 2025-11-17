"use client";

import { Stack } from "expo-router";

export default function ShowtimesLayout() {
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
          title: "Quản lý suất chiếu",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Thêm suất chiếu",
          headerBackTitle: "Quay lại",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Chỉnh sửa suất chiếu",
          headerBackTitle: "Quay lại",
        }}
      />
    </Stack>
  );
}
