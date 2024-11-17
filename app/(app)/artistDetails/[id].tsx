import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getArtistById } from "@/api/artistApi"; // API to fetch artist details
import { getAllArtworks } from "@/api/artworkApi"; // API to fetch artworks
import ArtistCard from "@/components/ArtistCard"; // Reuse ArtistCard for the artist details
import ArtworkList from "@/components/ArtworkList"; // Reuse ArtworkList for the artworks

export default function ArtistDetails() {
  const { id } = useLocalSearchParams(); // Get artist ID from route params
  const [artist, setArtist] = useState<{
    id: string;
    displayName: string;
    email: string;
    profileImageUrl?: string;
    bio?: string;
  } | null>(null);

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      try {
        // Fetch artist details
        const artistData = await getArtistById(id as string);
        setArtist(artistData);

        // Fetch all artworks and filter by the artist's ID
        const allArtworks = await getAllArtworks();
        const filteredArtworks = allArtworks.filter(
          (artwork) => artwork.artistId === id
        );
        setArtworks(filteredArtworks);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching artist or artworks:", error);
        setLoading(false);
      }
    };

    fetchArtistAndArtworks();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artist not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display Artist Card */}
      <ArtistCard
        artist={{
          id: artist.id,
          displayName: artist.displayName,
          email: artist.email,
          profileImageUrl: artist.profileImageUrl,
          bio: artist.bio, // Include bio here
        }}
        onPress={() => {}} // No action needed for pressing in details view
      />

      {/* Display Artwork List */}
      <View style={styles.artworksContainer}>
        <Text style={styles.sectionTitle}>
          Artworks by {artist.displayName}
        </Text>
        <ArtworkList data={artworks} textSize={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  artworksContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
