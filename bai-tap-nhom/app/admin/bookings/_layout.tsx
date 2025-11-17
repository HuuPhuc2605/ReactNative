import { Stack } from "expo-router";

const COLORS = {
  primary: "#E50914",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
};

export default function BookingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.card,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.primary,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: COLORS.text,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Quản lý Đặt vé",
        }}
      />
    </Stack>
  );
}
