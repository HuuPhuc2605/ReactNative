"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native"
import { getMovies } from "../../db/movie.repo"

const COLORS = {
  primary: "#E50914",
  background: "#0f0f0f",
  card: "#1c1c1c",
  text: "#fff",
  placeholder: "#888",
  gray: "#555",
}

export default function SearchScreen() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  // Load movies based on search query
  const loadMovies = () => {
    if (search.trim()) {
      getMovies({ search }, (data) => setMovies(data))
    } else {
      setMovies([])
    }
  }

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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Search Bar */}
      <View
        style={{
          backgroundColor: COLORS.card,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 24,
          paddingHorizontal: 14,
          margin: 16,
          marginBottom: 12,
        }}
      >
        <Ionicons name="search" size={20} color={COLORS.placeholder} />
        <TextInput
          placeholder="Search for movies..."
          placeholderTextColor={COLORS.placeholder}
          value={search}
          onChangeText={setSearch}
          autoFocus
          style={{
            flex: 1,
            color: COLORS.text,
            paddingVertical: 12,
            paddingHorizontal: 10,
            fontSize: 14,
          }}
        />
        {search ? (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close" size={20} color={COLORS.placeholder} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleMoviePress(item.id)}
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.card,
              borderRadius: 12,
              padding: 10,
              marginBottom: 10,
              alignItems: "center",
              elevation: 2,
            }}
          >
            {/* Poster */}
            {item.posterUrl ? (
              <Image
                source={{ uri: item.posterUrl }}
                style={{
                  width: 60,
                  height: 90,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 90,
                  borderRadius: 8,
                  marginRight: 12,
                  backgroundColor: COLORS.gray,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="image-outline" size={24} color="#ccc" />
              </View>
            )}

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
              <Text style={{ color: COLORS.placeholder, fontSize: 13 }}>
                🎭 {item.genre || "Chưa rõ"} | ⏱ {item.duration} phút
              </Text>
              <Text style={{ color: COLORS.placeholder, fontSize: 13 }}>⭐ {item.rating || 0}/10</Text>
            </View>

            {/* Arrow */}
            <Ionicons name="chevron-forward" size={20} color={COLORS.placeholder} />
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
            {search ? "No movies found" : "Enter a search term to find movies"}
          </Text>
        )}
      />
    </View>
  )
}
