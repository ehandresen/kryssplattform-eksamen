import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Button, StyleSheet } from "react-native";
import { fetchArtworks, ArtworkData } from "@/api/artworkApi";
import UploadForm from "@/components/uploadForm"; // Import the upload form component

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const getArtworks = async () => {
      const fetchedArtworks = await fetchArtworks();
      console.log("Fetched Artworks:", fetchedArtworks); // Log the fetched artworks
      setArtworks(fetchedArtworks);
    };

    getArtworks();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={styles.title}>Welcome to ArtVista</Text>
      <Button
        title={showForm ? "Hide Upload Form" : "Upload New Artwork"}
        onPress={() => setShowForm(!showForm)}
      />
      {showForm ? <UploadForm /> : null}
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log("Rendering Item:", item); // Log each item before rendering
          return (
            <View style={styles.artworkContainer}>
              <Image source={{ uri: item.imageURL }} style={styles.image} />
              <Text style={styles.artworkTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.artistName}>By: {item.artist}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  artworkContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  artworkTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artistName: {
    fontStyle: "italic",
  },
});
