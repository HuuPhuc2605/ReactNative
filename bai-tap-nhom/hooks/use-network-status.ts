"use client";

/**
 * 🌐 Custom Hook: useNetworkStatus
 * Theo dõi trạng thái kết nối mạng
 *
 * Cách dùng:
 * const { isOnline, syncStatus } = useNetworkStatus();
 *
 * if (!isOnline) {
 *   // Hiển thị cảnh báo offline
 * }
 */

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">(
    "idle"
  );

  useEffect(() => {
    // Kiểm tra trạng thái mạng ban đầu
    (async () => {
      const state = await NetInfo.fetch();
      setIsOnline(state.isConnected || false);
    })();

    // Lắng nghe sự thay đổi trạng thái mạng
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected || false);
      console.log(
        `[v0] Network status: ${state.isConnected ? "online" : "offline"}`
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline,
    syncStatus,
    setSyncStatus,
  };
}
