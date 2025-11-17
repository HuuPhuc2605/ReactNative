"use client"

import { Ionicons } from "@expo/vector-icons"
import { Tabs, useRouter } from "expo-router"
import { Alert } from "react-native"
import { signOutUser } from "../../../src/utils/auth"

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  tabActive: "#E50914",
  tabInactive: "#666",
}

export default function TabsLayout() {
  const router = useRouter()
  
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("[v0] Processing logout...")
            const success = await signOutUser()
            
            if (!success) {
              Alert.alert("❌", "Lỗi khi đăng xuất. Vui lòng thử lại.")
            } else {
              console.log("[v0] Logout successful")
              Alert.alert("✅", "Đã đăng xuất thành công", [
                {
                  text: "OK",
                  onPress: () => {
                    setTimeout(() => {
                      router.dismissAll()
                      router.replace("/" as any)
                    }, 100)
                  },
                },
              ])
            }
          } catch (error) {
            console.error("[v0] Logout error:", error)
            Alert.alert("❌", "Lỗi khi đăng xuất. Vui lòng thử lại.")
          }
        },
      },
    ])
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: "#333",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-bookings"
        options={{
          title: "Watch list",
          tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            handleLogout()
          },
        }}
        options={{
          title: "Logout",
          tabBarIcon: ({ color }) => <Ionicons name="log-out" size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}
