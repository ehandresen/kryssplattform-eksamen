import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { getArtworkById } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import * as artworkApi from "@/api/artworkApi";
import * as commentApi from "@/api/commentApi";
import { CommentObject } from "@/types/comment";
import ArtworkCard from "@/components/gallery/ArtworkCard";

export default function ArtDetails() {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchArtworkFromFirebase();
  }, []);

  const fetchArtworkFromFirebase = async () => {
    try {
      console.log("Fetching Artwork with ID:", id);
      const fetchedArtwork = await artworkApi.getArtworkById(id as string);
      console.log("Fetched Artwork:", fetchedArtwork);

      if (fetchedArtwork) {
        setArtwork(fetchedArtwork);
        fetchCommentsFromFirebase(fetchedArtwork.comments);
      }
      setLoading(false);
    } catch (error) {
      console.log("error fetching artwork", error);
    }
  };

  const fetchCommentsFromFirebase = async (commentsIds: string[]) => {
    try {
      const comments = await commentApi.getCommentsByIds(commentsIds);

      if (comments) {
        setComments(comments);
      }
      setIsLoadingComments(false);
    } catch (error) {
      console.log("error fetching comments", error);
    }
  };

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
        // <>
        //   <Image source={{ uri: artwork.imageUrl }} style={styles.image} />
        //   <Text style={styles.title}>{artwork.title}</Text>
        //   <Text style={styles.description}>{artwork.description}</Text>
        //   <Text style={styles.artist}>By: {artwork.artistId}</Text>
        //   <Link href="/(app)/gallery">
        //     <Text>go back</Text>
        //   </Link>
        // </>
        <ArtworkCard artwork={artwork} />
      ) : (
        <Text>Artwork not found.</Text>
      )}

      {/* comments */}
      <View className="mt-4 w-full">
        <Text className="text-lg mb-2">Comments</Text>
        <View>
          {isLoadingComments ? (
            <ActivityIndicator />
          ) : (
            comments.map((comment) => (
              <View
                key={comment.id}
                className="flex-row py-2 border-b border-gray-300"
              >
                <Text className="font-bold mr-2">
                  {comment.comment.artistName}
                </Text>
                <Text className="flex-1">{comment.comment.comment}</Text>
              </View>
            ))
          )}
        </View>
      </View>
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
