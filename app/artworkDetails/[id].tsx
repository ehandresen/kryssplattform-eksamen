import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchArtworkById, ArtworkData } from "@/api/artworkApi";

export default function ArtDetails() {
  const { id } = useLocalSearchParams();
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArtwork = async () => {
      if (id) {
        console.log("Fetching Artwork with ID:", id); // Log the ID being fetched
        const fetchedArtwork = await fetchArtworkById(id as string);
        console.log("Fetched Artwork:", fetchedArtwork); // Log the fetched artwork
        setArtwork(fetchedArtwork);
        setLoading(false);
      }
    };

    getArtwork();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {artwork ? (
        <>
          <Image source={{ uri: artwork.imageURL }} style={styles.image} />
          <Text style={styles.title}>{artwork.title}</Text>
          <Text style={styles.description}>{artwork.description}</Text>
          <Text style={styles.artist}>By: {artwork.artist}</Text>
        </>
      ) : (
        <Text>Artwork not found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  artist: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
