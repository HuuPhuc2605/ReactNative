"use client";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  getRevenueByDay,
  getRevenueByMovie,
  getSummaryStats,
} from "../../../db/statistics.repo";

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  success: "#27ae60",
  warning: "#f39c12",
  accent: "#3498db",
  gray: "#555",
};

interface RevenueDay {
  date: string;
  ticket_count: number;
  total_revenue: number;
}

interface RevenueMovie {
  movie_id: number;
  movie_title: string;
  ticket_count: number;
  total_revenue: number;
  showtime_count: number;
}

interface SummaryStats {
  today_tickets?: number;
  today_revenue?: number;
  total_tickets?: number;
  total_customers?: number;
  total_revenue?: number;
  topMovie?: {
    id: number;
    title: string;
    ticket_count: number;
    revenue: number;
  };
}

export default function StatisticsScreen() {
  const [activeTab, setActiveTab] = useState<"overview" | "day" | "movie">(
    "overview"
  );
  const [revenueByDay, setRevenueByDay] = useState<RevenueDay[]>([]);
  const [revenueByMovie, setRevenueByMovie] = useState<RevenueMovie[]>([]);
  const [summary, setSummary] = useState<SummaryStats>({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const loadAllData = useCallback(() => {
    setLoading(true);
    setRevenueByDay([]);
    setRevenueByMovie([]);
    setSummary({});

    try {
      // Load summary stats
      getSummaryStats(
        (data: SummaryStats) => {
          console.log("[v0] Summary loaded:", data);
          setSummary(data);
        },
        (err: unknown) => {
          console.error("[v0] Error loading summary:", err);
          Alert.alert("Lỗi", "Không thể tải dữ liệu tổng hợp");
        }
      );

      // Load revenue by day
      getRevenueByDay(
        (data: RevenueDay[]) => {
          console.log("[v0] Revenue by day loaded:", data);
          setRevenueByDay(data);
        },
        (err: unknown) => {
          console.error("[v0] Error loading revenue by day:", err);
        }
      );

      // Load revenue by movie
      getRevenueByMovie(
        (data: RevenueMovie[]) => {
          console.log("[v0] Revenue by movie loaded:", data);
          setRevenueByMovie(data);
        },
        (err: unknown) => {
          console.error("[v0] Error loading revenue by movie:", err);
        }
      );
    } catch (err) {
      console.error("[v0] Error in loadAllData:", err);
    } finally {
      setLoading(false);
      hasLoadedRef.current = true;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("[v0] Statistics screen focused, loading fresh data");
      hasLoadedRef.current = false;
      loadAllData();
    }, [loadAllData])
  );

  // Format currency
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return "0 VND";
    return `${value.toLocaleString("vi-VN")} VND`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // =====================
  // OVERVIEW TAB
  // =====================
  const OverviewTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadAllData();
            setTimeout(() => setRefreshing(false), 600);
          }}
        />
      }
    >
      {/* Summary Cards */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 16,
          justifyContent: "space-between",
        }}
      >
        {/* Today's Revenue */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.success,
          }}
        >
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            Doanh thu hôm nay
          </Text>
          <Text
            style={{
              color: COLORS.success,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {formatCurrency(summary.today_revenue)}
          </Text>
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 10,
              marginTop: 4,
            }}
          >
            {summary.today_tickets} vé
          </Text>
        </View>

        {/* Total Revenue */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.accent,
          }}
        >
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            Tổng doanh thu
          </Text>
          <Text
            style={{
              color: COLORS.accent,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {formatCurrency(summary.total_revenue)}
          </Text>
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 10,
              marginTop: 4,
            }}
          >
            {summary.total_tickets} vé
          </Text>
        </View>
      </View>

      {/* Customers & Top Movie */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 16,
          justifyContent: "space-between",
        }}
      >
        {/* Total Customers */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.warning,
          }}
        >
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            Khách hàng
          </Text>
          <Text
            style={{
              color: COLORS.warning,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {summary.total_customers || 0}
          </Text>
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 10,
              marginTop: 4,
            }}
          >
            Người
          </Text>
        </View>

        {/* Top Movie */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.primary,
          }}
        >
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            Phim bán chạy
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.primary,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {summary.topMovie?.title || "N/A"}
          </Text>
          <Text
            style={{
              color: COLORS.placeholder,
              fontSize: 10,
              marginTop: 4,
            }}
          >
            {summary.topMovie?.ticket_count || 0} vé
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  // =====================
  // REVENUE BY DAY TAB
  // =====================
  const DayTab = () => (
    <FlatList
      data={revenueByDay}
      keyExtractor={(item, index) => `${item.date}-${index}`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadAllData();
            setTimeout(() => setRefreshing(false), 600);
          }}
        />
      }
      renderItem={({ item }: { item: RevenueDay }) => (
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.success,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                📅 {formatDate(item.date)}
              </Text>
              <Text
                style={{
                  color: COLORS.placeholder,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {item.ticket_count} vé bán
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.success,
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {formatCurrency(item.total_revenue)}
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              height: 6,
              backgroundColor: COLORS.gray,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: COLORS.success,
                width: `${Math.min(
                  (item.total_revenue / 10000000) * 100,
                  100
                )}%`,
              }}
            />
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text
          style={{
            color: COLORS.placeholder,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Không có dữ liệu thống kê.
        </Text>
      )}
    />
  );

  // =====================
  // REVENUE BY MOVIE TAB
  // =====================
  const MovieTab = () => (
    <FlatList
      data={revenueByMovie}
      keyExtractor={(item) => item.movie_id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadAllData();
            setTimeout(() => setRefreshing(false), 600);
          }}
        />
      }
      renderItem={({ item }: { item: RevenueMovie }) => (
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.accent,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text
                numberOfLines={2}
                style={{
                  color: COLORS.text,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                🎬 {item.movie_title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginTop: 6,
                }}
              >
                <Text
                  style={{
                    color: COLORS.placeholder,
                    fontSize: 12,
                  }}
                >
                  🎞️ {item.showtime_count} suất
                </Text>
                <Text
                  style={{
                    color: COLORS.placeholder,
                    fontSize: 12,
                  }}
                >
                  🪑 {item.ticket_count} vé
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: COLORS.accent,
                fontSize: 13,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {formatCurrency(item.total_revenue)}
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              height: 6,
              backgroundColor: COLORS.gray,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: COLORS.accent,
                width: `${Math.min(
                  (item.total_revenue / 10000000) * 100,
                  100
                )}%`,
              }}
            />
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text
          style={{
            color: COLORS.placeholder,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Không có dữ liệu thống kê.
        </Text>
      )}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      {/* Header */}
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        📊 Thống kê cơ bản
      </Text>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {(["overview", "day", "movie"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: activeTab === tab ? COLORS.primary : COLORS.card,
              borderWidth: activeTab === tab ? 0 : 1,
              borderColor: COLORS.gray,
            }}
          >
            <Text
              style={{
                color: activeTab === tab ? "#fff" : COLORS.placeholder,
                fontWeight: activeTab === tab ? "bold" : "normal",
                fontSize: 12,
              }}
            >
              {tab === "overview"
                ? "Tổng quan"
                : tab === "day"
                ? "Theo ngày"
                : "Theo phim"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "day" && <DayTab />}
      {activeTab === "movie" && <MovieTab />}
    </View>
  );
}
