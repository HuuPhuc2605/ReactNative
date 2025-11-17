"use client";

import { useLocalSearchParams } from "expo-router";
import EditShowtimeScreen from "../../../../src/screens/admin/showtimes/EditShowtimeScreen";

export default function EditShowtimePage() {
  const { id } = useLocalSearchParams();

  return <EditShowtimeScreen id={typeof id === "string" ? id : ""} />;
}
