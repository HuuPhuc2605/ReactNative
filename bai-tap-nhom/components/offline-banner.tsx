/**
 * 🔴 Offline Banner
 * Hiển thị thông báo khi không có mạng
 *
 * Cách dùng:
 * <OfflineBanner isOnline={isOnline} />
 */

import { Text, View } from "react-native";
import { useNetworkStatus } from "../hooks/use-network-status";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View
      style={{
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
        ⚠️ Bạn đang ở chế độ Offline
      </Text>
      <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
        Chỉ có thể xem danh sách phim, không thể đặt vé
      </Text>
    </View>
  );
}
