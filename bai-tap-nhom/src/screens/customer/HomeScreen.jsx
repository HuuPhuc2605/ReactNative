"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Alert, FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native"
import { getMovies } from "../../db/movie.repo"

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  accent: "#ffc107",
  tabActive: "#E50914",
  tabInactive: "#666",
}

export default function CustomerHomeScreen() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Now playing")
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const router = useRouter()

  const categories = ["Now playing", "Upcoming", "Top rated", "Popular"]

  // 📌 Load danh sách phim
  const loadMovies = () => {
    getMovies({ search }, (data) => setMovies(data))
  }

  // Gọi lại mỗi khi quay lại trang
  useFocusEffect(
    useCallback(() => {
      loadMovies()
    }, [search]),
  )

  const handleMoviePress = (movieId) => {
    router.push({
      pathname: "../movie-detail",
      params: { id: movieId },
    })
  }

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => router.push("/(customer)/(tabs)/logout"),
      },
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}
        scrollEnabled={false}
      >
        {/* Title */}
        <Text
          style={{
            color: COLORS.text,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          What do you want to watch?
        </Text>

        <View
          style={{
            backgroundColor: COLORS.card,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 24,
            paddingHorizontal: 14,
            marginBottom: 20,
          }}
        >
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.placeholder}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              color: COLORS.text,
              paddingVertical: 10,
              fontSize: 14,
            }}
          />
          <Ionicons name="search" size={20} color={COLORS.placeholder} />
        </View>

        {/* Featured Movies Carousel */}
        <View style={{ marginBottom: 24 }}>
          <FlatList
            data={movies.slice(0, 2)}
            keyExtractor={(item) => `featured-${item.id}`}
            horizontal
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={160}
            decelerationRate="fast"
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleMoviePress(item.id)}
                style={{
                  width: 140,
                  height: 200,
                  borderRadius: 16,
                  overflow: "hidden",
                  elevation: 4,
                }}
              >
                {item.posterUrl ? (
                  <Image source={{ uri: item.posterUrl }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#444",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="image-outline" size={32} color="#888" />
                  </View>
                )}
              </Pressable>
            )}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, marginBottom: 20 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                paddingBottom: 8,
                borderBottomWidth: selectedCategory === category ? 2 : 0,
                borderBottomColor: selectedCategory === category ? COLORS.primary : "transparent",
              }}
            >
              <Text
                style={{
                  color: selectedCategory === category ? COLORS.text : COLORS.tabInactive,
                  fontSize: 14,
                  fontWeight: selectedCategory === category ? "bold" : "500",
                }}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleMoviePress(item.id)}
            style={{
              width: "31%",
              marginBottom: 12,
              borderRadius: 12,
              overflow: "hidden",
              elevation: 3,
            }}
          >
            {item.posterUrl ? (
              <Image
                source={{ uri: item.posterUrl }}
                style={{
                  width: "100%",
                  height: 160,
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 160,
                  backgroundColor: "#444",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="image-outline" size={28} color="#888" />
              </View>
            )}
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: COLORS.placeholder,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            No movies found
          </Text>
        )}
      />
    </View>
  )
}
