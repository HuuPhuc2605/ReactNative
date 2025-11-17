import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../db/firebase";

// Initialize web browser for auth
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  console.log("[v0] Google Auth Config:");
  console.log("[v0] WEB_CLIENT_ID:", webClientId ? "SET" : "MISSING");
  console.log(
    "[v0] ANDROID_CLIENT_ID:",
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ? "SET" : "MISSING"
  );
  console.log(
    "[v0] IOS_CLIENT_ID:",
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ? "SET" : "MISSING"
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || webClientId,
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || webClientId,
    webClientId: webClientId,
    redirectUrl: "mycinemaapp://auth",
    scopes: ["profile", "email"],
  });

  return { request, response, promptAsync };
};

export const handleGoogleAuthResponse = async (response) => {
  try {
    if (response?.type !== "success") {
      return {
        success: false,
        user: {
          email: "",
          uid: "",
          displayName: "",
        },
        error: "Đăng nhập Google bị hủy",
      };
    }

    const { id_token } = response.params;

    if (!id_token) {
      return {
        success: false,
        user: {
          email: "",
          uid: "",
          displayName: "",
        },
        error: "Không lấy được token từ Google",
      };
    }

    const credential = GoogleAuthProvider.credential(id_token);
    const authResult = await signInWithCredential(auth, credential);
    const user = authResult.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || "",
        role: "customer",
        createdAt: new Date(),
      });
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
      },
    };
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    return {
      success: false,
      user: {
        email: "",
        uid: "",
        displayName: "",
      },
      error: error?.message || "Lỗi đăng nhập Google",
    };
  }
};

// Email/Password sign in
export const signInWithEmail = async (email, password) => {
  try {
    const authResult = await signInWithEmailAndPassword(auth, email, password);

    if (!authResult || !authResult.user) {
      return {
        success: false,
        error: "Không lấy được thông tin người dùng từ Firebase",
      };
    }

    const user = authResult.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    // If user doesn't exist, create their profile
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        role: "customer",
        createdAt: new Date(),
      });
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
      },
    };
  } catch (error) {
    console.error("Lỗi đăng nhập email:", error);
    return {
      success: false,
      error: error?.message || "Email hoặc mật khẩu không chính xác",
    };
  }
};
