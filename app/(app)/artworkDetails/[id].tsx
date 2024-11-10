// screens/ArtDetails.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Artwork } from "@/types/artwork";
import * as artworkApi from "@/api/artworkApi";
import * as commentApi from "@/api/commentApi";
import { CommentObject } from "@/types/comment";
import ArtworkCard from "@/components/ArtworkCard";
import { useAuth } from "@/hooks/useAuth";
import { useTextSize } from "@/hooks/useTextSize"; // Import the text size hook

export default function ArtDetails() {
  const { textSize } = useTextSize(); // Access textSize from the context
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoadingAddComment, setIsLoadingAddComment] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);

  const { id } = useLocalSearchParams();
  const { session, user } = useAuth();

  useEffect(() => {
    fetchArtworkFromFirebase();
  }, []);

  const fetchArtworkFromFirebase = async () => {
    try {
      const fetchedArtwork = await artworkApi.getArtworkById(id as string);

      if (fetchedArtwork) {
        setArtwork(fetchedArtwork);
        setIsLiked(fetchedArtwork.likes.includes(user?.uid ?? ""));
        setNumLikes(fetchedArtwork.likes.length);
        fetchCommentsFromFirebase(fetchedArtwork.comments);
      }
      setLoading(false);
    } catch (error) {
      console.log("error fetching artwork", error);
    }
  };

  const toggleLike = async () => {
    if (!artwork) return;

    const updatedLikes = isLiked
      ? artwork.likes.filter((uid) => uid !== user?.uid)
      : [...artwork.likes, user?.uid ?? ""];

    setIsLiked(!isLiked);
    setNumLikes(updatedLikes.length);
    setArtwork({ ...artwork, likes: updatedLikes });

    await artworkApi.updateArtworkLikes(artwork.id, user?.uid ?? "");
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

  const handleAddComment = async () => {
    if (artwork && commentText !== "") {
      setIsLoadingAddComment(true);

      try {
        const newCommentId = await commentApi.addComment(artwork.id, {
          artistId: user?.uid ?? "unknown",
          artistName: session as string,
          comment: commentText,
        });

        if (newCommentId) {
          setCommentText("");

          const updatedCommentsIds = [
            ...(artwork.comments || []),
            newCommentId,
          ];
          setArtwork({ ...artwork, comments: updatedCommentsIds });

          await fetchCommentsFromFirebase(updatedCommentsIds);
        }
      } catch (error) {
        console.log("Error adding comment:", error);
      } finally {
        setIsLoadingAddComment(false);
      }
    }
  };

  const handleDeleteArtwork = async () => {
    if (artwork?.artistId !== user?.uid) {
      Alert.alert("Error", "You can only delete artworks that you created.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this artwork?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (artwork) {
                await artworkApi.deleteArtwork(artwork.id);
                setArtwork(null);
              }
            } catch (error) {
              console.error("Error deleting artwork:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 16, marginBottom: 24 }}>
        {artwork ? (
          <>
            <ArtworkCard
              artwork={artwork}
              isLiked={isLiked}
              numLikes={numLikes}
              toggleLike={toggleLike}
              textSize={textSize} // Pass textSize to ArtworkCard
            />
            {artwork.artistId === user?.uid && (
              <Pressable
                onPress={handleDeleteArtwork}
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: textSize,
                    fontWeight: "bold",
                  }}
                >
                  Delete Artwork
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <Text
            style={{ textAlign: "center", color: "#555", fontSize: textSize }}
          >
            Artwork not found.
          </Text>
        )}

        <View style={{ marginTop: 20, width: "100%" }}>
          <Text style={{ fontSize: textSize + 2, marginBottom: 10 }}>
            Comments
          </Text>
          <View>
            {isLoadingComments ? (
              <ActivityIndicator />
            ) : (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#ddd",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 5,
                      fontSize: textSize,
                    }}
                  >
                    {comment.comment?.artistName ?? "Unknown Artist"}
                  </Text>
                  <Text style={{ flex: 1, fontSize: textSize }}>
                    {comment.comment?.comment ?? "No comment text available"}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: 10,
          }}
        >
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="gray"
            style={{
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              padding: 8,
              marginRight: 10,
              fontSize: textSize,
            }}
          />
          <Pressable
            onPress={handleAddComment}
            disabled={isLoadingAddComment}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: "blue",
              borderRadius: 5,
            }}
          >
            {isLoadingAddComment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={{
                  color: "white",
                  fontSize: textSize,
                  fontWeight: "bold",
                }}
              >
                Add
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
