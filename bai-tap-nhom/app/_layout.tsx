import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { initNetworkListener, syncAllData } from "../src/cloud/sync-manager";
import { auth } from "../src/db/firebase";
import { initDatabase } from "../src/db/init";

export default function Layout() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      await initDatabase();
      await initNetworkListener();
      await syncAllData();
      setIsInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    console.log("[v0] Setting up auth state listener...");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[v0] Auth state changed, user:", user?.email || "null");
      setCurrentUser(user);

      if (!user) {
        console.log("[v0] User logged out, preparing to navigate to login...");
        // Navigation will happen when currentUser becomes null and component re-renders
      } else {
        console.log("[v0] User logged in:", user.email);
        // User is logged in, rendering will handle navigation to correct screen
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    );
  }

  if (currentUser === undefined) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    );
  }

  if (currentUser === null) {
    console.log("[v0] Rendering login screen - user is logged out");
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
      </Stack>
    );
  }

  console.log("[v0] Rendering app for user:", currentUser.email);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen
        name="(customer)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
