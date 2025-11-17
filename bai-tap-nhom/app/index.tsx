"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { syncAllForUser } from "../src/cloud/sync";
import { auth } from "../src/db/firebase";
import {
  handleGoogleAuthResponse,
  useGoogleAuth,
} from "../src/utils/googleAuth";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  google: "#4285F4",
};

const STORAGE_KEY = "cinema_app_login";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { promptAsync } = useGoogleAuth();

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { email, password: pwd, remembered } = JSON.parse(saved);
        if (remembered) {
          setUsername(email || "");
          setPassword(pwd || "");
          setRememberPassword(true);
        }
      }
    } catch (err) {
      console.error("[v0] Error loading saved credentials:", err);
    }
  };

  const saveCredentials = async (
    email: string,
    pwd: string,
    remember: boolean
  ) => {
    try {
      if (remember) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ email, password: pwd, remembered: true })
        );
        console.log("[v0] ✅ Credentials saved successfully");
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("[v0] Credentials cleared");
      }
    } catch (err) {
      console.error("[v0] Error saving credentials:", err);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert("❗", "Vui lòng nhập email và mật khẩu.");
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      const user = userCredential.user;
      const email = user.email || "";

      await saveCredentials(username, password, rememberPassword);

      console.log(`🔄 Đồng bộ booking của ${email}...`);
      await syncAllForUser(email);

      if (email.includes("admin")) {
        Alert.alert("✅", "Đăng nhập thành công!");
        router.push("/admin" as any);
      } else {
        Alert.alert("✅", "Đăng nhập thành công!");
        router.push("/(customer)/(tabs)");
      }
    } catch (err: any) {
      const message =
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
          ? "Sai tài khoản hoặc mật khẩu."
          : err?.message || "Lỗi khi đăng nhập.";
      Alert.alert("❌", message);
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await promptAsync();
      const result = await handleGoogleAuthResponse(response);

      if (result.success && result.user?.email) {
        console.log(`🔄 Đồng bộ booking của ${result.user.email}...`);
        await syncAllForUser(result.user.email);

        Alert.alert("✅", "Đăng nhập Google thành công!");
        if (result.user.email?.includes("admin")) {
          router.push("/admin" as any);
        } else {
          router.push("/(customer)/(tabs)");
        }
      } else {
        Alert.alert("❌", result.error || "Lỗi đăng nhập Google.");
      }
    } catch (err: any) {
      Alert.alert("❌", "Lỗi khi đăng nhập Google.");
      console.error("Lỗi đăng nhập Google:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Đang xử lý đăng nhập...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: COLORS.background,
      }}
    >
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        🎬 Đăng nhập
      </Text>

      <Text style={{ color: COLORS.text, marginBottom: 6 }}>Email</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Nhập email"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: COLORS.card,
          color: COLORS.text,
          borderRadius: 10,
          padding: 10,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.placeholder,
        }}
      />

      <Text style={{ color: COLORS.text, marginBottom: 6 }}>Mật khẩu</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry
        style={{
          backgroundColor: COLORS.card,
          color: COLORS.text,
          borderRadius: 10,
          padding: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: COLORS.placeholder,
        }}
      />

      <Pressable
        onPress={() => setRememberPassword(!rememberPassword)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: COLORS.primary,
            backgroundColor: rememberPassword ? COLORS.primary : "transparent",
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {rememberPassword && (
            <Text
              style={{
                color: COLORS.background,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              ✓
            </Text>
          )}
        </View>
        <Text style={{ color: COLORS.text, fontSize: 14 }}>
          Ghi nhớ mật khẩu
        </Text>
      </Pressable>

      <Pressable
        onPress={handleLogin}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Đăng nhập
        </Text>
      </Pressable>

      <Pressable
        onPress={handleGoogleLogin}
        style={{
          backgroundColor: COLORS.google,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Đăng nhập với Google
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signup" as any)}>
        <Text
          style={{ color: COLORS.primary, textAlign: "center", fontSize: 14 }}
        >
          Chưa có tài khoản? Đăng ký
        </Text>
      </Pressable>
    </View>
  );
}
