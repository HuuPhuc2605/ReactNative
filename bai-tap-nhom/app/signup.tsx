"use client"

import { useRouter } from "expo-router"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native"
import { syncAllForUser } from "../src/cloud/sync"
import { auth, db } from "../src/db/firebase"
import { handleGoogleAuthResponse, useGoogleAuth } from "../src/utils/googleAuth"

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  google: "#4285F4",
}

export default function SignupScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { promptAsync } = useGoogleAuth()

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert("❗", "Vui lòng điền đầy đủ thông tin.")
    }

    if (password !== confirmPassword) {
      return Alert.alert("❗", "Mật khẩu không khớp.")
    }

    if (password.length < 6) {
      return Alert.alert("❗", "Mật khẩu phải ít nhất 6 ký tự.")
    }

    setLoading(true)
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: email.includes("admin") ? "admin" : "customer",
        createdAt: new Date(),
      })

      console.log(`🔄 Đồng bộ booking của ${email}...`)
      await syncAllForUser(email)

      Alert.alert("✅", "Đăng ký thành công!")
      if (email.includes("admin")) {
        router.push("/admin" as any)
      } else {
        router.push("/(customer)/(tabs)")
      }
    } catch (err: any) {
      const message =
        err?.code === "auth/email-already-in-use"
          ? "Email đã được sử dụng."
          : err?.code === "auth/invalid-email"
            ? "Email không hợp lệ."
            : err?.message || "Lỗi khi đăng ký."
      Alert.alert("❌", message)
      console.error("Lỗi đăng ký:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      const result = await promptAsync()
      if (result?.type === "success") {
        const authResponse = await handleGoogleAuthResponse(result)
        if (authResponse.success && authResponse.user) {
          console.log(`🔄 Đồng bộ booking của ${authResponse.user.email}...`)
          await syncAllForUser(authResponse.user.email)

          Alert.alert("✅", "Đăng ký Google thành công!")
          if (authResponse.user.email?.includes("admin")) {
            router.push("/admin" as any)
          } else {
            router.push("/(customer)/(tabs)")
          }
        } else {
          Alert.alert("❌", authResponse.error || "Lỗi đăng ký Google.")
        }
      }
    } catch (err: any) {
      Alert.alert("❌", "Lỗi khi đăng ký Google.")
      console.error("Lỗi đăng ký Google:", err)
    } finally {
      setLoading(false)
    }
  }

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
        <Text style={{ color: "#fff", marginTop: 10 }}>Đang xử lý đăng ký...</Text>
      </View>
    )
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
        🎬 Đăng ký
      </Text>

      <Text style={{ color: COLORS.text, marginBottom: 6 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
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
        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry
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

      <Text style={{ color: COLORS.text, marginBottom: 6 }}>Xác nhận mật khẩu</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Xác nhận mật khẩu"
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
        onPress={handleSignup}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Đăng ký</Text>
      </Pressable>

      <Pressable
        onPress={handleGoogleSignup}
        style={{
          backgroundColor: COLORS.google,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Đăng ký với Google</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/" as any)}>
        <Text style={{ color: COLORS.primary, textAlign: "center", fontSize: 14 }}>Đã có tài khoản? Đăng nhập</Text>
      </Pressable>
    </View>
  )
}
