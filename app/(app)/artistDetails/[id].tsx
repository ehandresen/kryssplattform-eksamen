import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getArtistById } from "@/api/artistApi"; // API to fetch artist details
import { getAllArtworks } from "@/api/artworkApi"; // API to fetch artworks
import ArtistCard from "@/components/ArtistCard"; // Reuse ArtistCard for the artist details
import ArtworkList from "@/components/ArtworkList"; // Reuse ArtworkList for the artworks
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook

export default function ArtistDetails() {
  const { id } = useLocalSearchParams(); // Get artist ID from route params
  const { textSize, currentColors } = useAccessibility(); // Accessibility hook
  const [artist, setArtist] = useState<{
    id: string;
    displayName: string;
    email: string;
    profileImageUrl?: string;
    bio?: string;
  } | null>(null);

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      try {
        // Fetch artist details
        const artistData = await getArtistById(id as string);

        if (!artistData) {
          setError("Artist not found.");
          setLoading(false);
          return;
        }

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
        setError("An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchArtistAndArtworks();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentColors.secondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: currentColors.error }]}>
          {error}
        </Text>
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
        textSize={16}
      />

      {/* Display Artwork List */}
      <View style={styles.artworksContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: currentColors.primary, fontSize: textSize },
          ]}
        >
          Artworks by {artist.displayName}
        </Text>
        <ArtworkList data={artworks} textSize={textSize} />
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
