"use client"

import HomeScreen from "@/src/screens/customer/HomeScreen"
import { useEffect, useState } from "react"
import { View } from "react-native"

export default function CustomerHome() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return <View style={{ flex: 1 }}>{isLoaded && <HomeScreen />}</View>
}
