"use client";

import { Stack } from "expo-router";

export default function TheatersLayout() {
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
          title: "Quản lý rạp chiếu",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="add-theater"
        options={{
          title: "Thêm rạp chiếu",
          headerBackTitle: "Quay lại",
        }}
      />
      <Stack.Screen
        name="edit-theater"
        options={{
          title: "Chỉnh sửa rạp chiếu",
          headerBackTitle: "Quay lại",
        }}
      />
      <Stack.Screen
        name="add-screen"
        options={{
          title: "Thêm phòng chiếu",
          headerBackTitle: "Quay lại",
        }}
      />
      <Stack.Screen
        name="edit-screen"
        options={{
          title: "Chỉnh sửa phòng chiếu",
          headerBackTitle: "Quay lại",
        }}
      />
    </Stack>
  );
}
