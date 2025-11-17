"use client";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

const COLORS = {
  primary: "#FF2D55",
  primaryDark: "#E50914",
  accent: "#00D9FF",
  background: "#0a0e27",
  backgroundLight: "#151b3c",
  card: "#1a1f4a",
  cardLight: "#252d5f",
  text: "#ffffff",
  textSecondary: "#a8b2d1",
  placeholder: "#6b7494",
  danger: "#ff4444",
  success: "#00d084",
  warning: "#ffa500",
  border: "#2a3054",
};

function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản lý không?",
      [
        {
          text: "Hủy",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            router.replace("/");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.card, COLORS.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          🎬 ADMIN CINEMA
        </Text>
        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: 12,
            marginTop: 4,
            fontWeight: "500",
          }}
        >
          Hệ thống quản lý rạp chiếu
        </Text>
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => ({
          backgroundColor: pressed ? COLORS.primaryDark : COLORS.primary,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          opacity: pressed ? 0.8 : 1,
          borderWidth: 1,
          borderColor: COLORS.primary,
        })}
      >
        <Ionicons name="log-out-outline" size={16} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          Đăng xuất
        </Text>
      </Pressable>
    </LinearGradient>
  );
}

export default function AdminLayout() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản lý không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            router.replace("/");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const DrawerContent = (props: any) => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header Section */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderStyle: "dashed",
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            ADMIN PANEL
          </Text>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 11,
              marginTop: 2,
              fontWeight: "500",
            }}
          >
            Quản lý hệ thống toàn bộ
          </Text>
        </View>
      </View>

      {/* Menu Sections */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {/* Core Management Section */}
        <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 11,
              fontWeight: "700",
              marginLeft: 12,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Quản Lý Chính
          </Text>

          {[
            { label: "Thống kê", icon: "bar-chart", name: "statistics" },
            { label: "Phim", icon: "film", name: "movies" },
            { label: "Rạp Chiếu", icon: "business", name: "theaters" },
          ].map((item) => (
            <Pressable
              key={item.name}
              onPress={() => {
                props.navigation.closeDrawer();
                router.push(`/admin/${item.name}` as any);
              }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginHorizontal: 0,
                marginVertical: 4,
                borderRadius: 10,
                backgroundColor: pressed ? COLORS.card : "transparent",
                borderLeftWidth: 3,
                borderLeftColor: pressed ? COLORS.primary : "transparent",
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: COLORS.card,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 14,
                  fontWeight: "500",
                  flex: 1,
                }}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color={COLORS.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        {/* Operations Section */}
        <View style={{ paddingHorizontal: 12, marginTop: 16 }}>
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 11,
              fontWeight: "700",
              marginLeft: 12,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Hoạt Động
          </Text>

          {[
            { label: "Suất Chiếu", icon: "time", name: "showtimes" },
            { label: "Đặt vé", icon: "ticket", name: "bookings" },
          ].map((item) => (
            <Pressable
              key={item.name}
              onPress={() => {
                props.navigation.closeDrawer();
                router.push(`/admin/${item.name}` as any);
              }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginHorizontal: 0,
                marginVertical: 4,
                borderRadius: 10,
                backgroundColor: pressed ? COLORS.card : "transparent",
                borderLeftWidth: 3,
                borderLeftColor: pressed ? COLORS.accent : "transparent",
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: COLORS.card,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={COLORS.accent}
                />
              </View>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 14,
                  fontWeight: "500",
                  flex: 1,
                }}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color={COLORS.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />
      </ScrollView>

      {/* Footer Section - Logout */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingHorizontal: 12,
          paddingVertical: 16,
        }}
      >
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: pressed ? COLORS.card : "transparent",
            borderWidth: 1,
            borderColor: COLORS.danger,
          })}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: COLORS.card,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              borderWidth: 1,
              borderColor: COLORS.danger,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          </View>
          <Text
            style={{
              color: COLORS.danger,
              fontSize: 14,
              fontWeight: "600",
              flex: 1,
            }}
          >
            Đăng xuất
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.card,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: COLORS.text,
        },
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              marginRight: 16,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
          </Pressable>
        ),
        drawerStyle: {
          backgroundColor: COLORS.background,
          borderRightWidth: 1,
          borderRightColor: COLORS.border,
        },
        sceneStyle: {
          backgroundColor: COLORS.background,
        },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="statistics"
        options={{
          title: "Thống kê",
        }}
      />

      <Drawer.Screen
        name="movies"
        options={{
          title: "Quản lý Phim",
        }}
      />

      <Drawer.Screen
        name="theaters"
        options={{
          title: "Quản lý Rạp Chiếu",
        }}
      />

      <Drawer.Screen
        name="showtimes"
        options={{
          title: "Quản lý Suất Chiếu",
        }}
      />

      <Drawer.Screen
        name="bookings"
        options={{
          title: "Quản lý Đặt vé",
        }}
      />

      <Drawer.Screen
        name="logout"
        options={{
          title: "Đăng xuất",
          headerShown: false,
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Drawer>
  );
}
