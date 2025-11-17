"use client"

import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Image, Pressable, ScrollView, Text, View } from "react-native"
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

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [movie, setMovie] = useState(null)
  const [selectedTab, setSelectedTab] = useState("About Movie")
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    getMovies({}, (data) => {
      const foundMovie = data.find((m) => m.id.toString() === id)
      setMovie(foundMovie || null)
      setLoading(false)
    })
  }, [id])

  const handleBooking = () => {
    if (movie) {
      router.push(`/(customer)/booking?movieId=${movie.id}`)
    }
  }

  const tabs = ["About Movie", "Reviews", "Cast"]

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.text }}>Loading...</Text>
      </View>
    )
  }

  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.text }}>Movie not found</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.card,
          borderBottomWidth: 1,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </Pressable>
        <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "bold" }}>Detail</Text>
        <Pressable onPress={() => setIsSaved(!isSaved)}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={COLORS.accent} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Movie Poster Banner */}
        <View
          style={{
            width: "100%",
            height: 280,
            backgroundColor: COLORS.card,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {movie.posterUrl ? (
            <Image
              source={{ uri: movie.posterUrl }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <Ionicons name="image-outline" size={48} color="#666" />
          )}
        </View>

        {/* Movie Info */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          {/* Title with Rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>
                {movie.title}
              </Text>
            </View>
            {movie.rating && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.card,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  marginLeft: 12,
                }}
              >
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: "bold", marginLeft: 4 }}>
                  {movie.rating}
                </Text>
              </View>
            )}
          </View>

          {/* Movie Metadata */}
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginBottom: 20,
              paddingBottom: 16,
              borderBottomColor: COLORS.card,
              borderBottomWidth: 1,
            }}
          >
            {movie.release_date && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="calendar" size={16} color={COLORS.placeholder} />
                <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>{movie.release_date}</Text>
              </View>
            )}
            {movie.duration && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="time" size={16} color={COLORS.placeholder} />
                <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>{movie.duration} Minutes</Text>
              </View>
            )}
            {movie.genre && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="play-circle" size={16} color={COLORS.placeholder} />
                <Text style={{ color: COLORS.placeholder, fontSize: 12 }}>{movie.genre}</Text>
              </View>
            )}
          </View>

          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              gap: 24,
              marginBottom: 16,
              borderBottomColor: COLORS.card,
              borderBottomWidth: 1,
            }}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: selectedTab === tab ? 2 : 0,
                  borderBottomColor: selectedTab === tab ? COLORS.primary : "transparent",
                }}
              >
                <Text
                  style={{
                    color: selectedTab === tab ? COLORS.text : COLORS.placeholder,
                    fontSize: 14,
                    fontWeight: selectedTab === tab ? "bold" : "500",
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          {selectedTab === "About Movie" && (
            <View>
              <Text style={{ color: COLORS.text, fontSize: 14, lineHeight: 20 }}>
                {movie.description || "No description available"}
              </Text>
            </View>
          )}

          {selectedTab === "Reviews" && (
            <View>
              <Text style={{ color: COLORS.placeholder, fontSize: 14 }}>No reviews yet</Text>
            </View>
          )}

          {selectedTab === "Cast" && (
            <View>
              <Text style={{ color: COLORS.text, fontSize: 14 }}>{movie.cast || "Cast information not available"}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Booking Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.card,
          borderTopWidth: 1,
        }}
      >
        <Pressable
          onPress={handleBooking}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 14,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "bold" }}>Book Ticket</Text>
        </Pressable>
      </View>
    </View>
  )
}
