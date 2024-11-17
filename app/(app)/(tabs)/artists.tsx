import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ArtistList from "../../../components/ArtistList";
import { getAllArtists } from "@/api/artistApi";
import { Artist } from "@/types/artist";

export default function ArtistsScreen() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const artistData = await getAllArtists();
      setArtists(artistData);
    };

    fetchArtists();
  }, []);

  return (
    <View style={styles.container}>
      <ArtistList artists={artists} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
