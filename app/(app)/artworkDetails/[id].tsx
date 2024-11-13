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
  TouchableOpacity,
  Button,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Artwork } from "@/types/artwork";
import * as artworkApi from "@/api/artworkApi";
import * as commentApi from "@/api/commentApi";
import * as exhibitionApi from "@/api/exhibitionApi";
import { CommentObject } from "@/types/comment";
import ArtworkCard from "@/components/ArtworkCard";
import { useAuth } from "@/hooks/useAuth";
import { useTextSize } from "@/hooks/useTextSize"; // Import the text size hook
import { FontAwesome } from "@expo/vector-icons";
import { Exhibition } from "@/types/exhibition";
import MapScreen from "../map";

export default function ArtDetails() {
  const { textSize } = useTextSize(); // Access textSize from the context
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoadingAddComment, setIsLoadingAddComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  const { id } = useLocalSearchParams();
  const { session, user } = useAuth();
  const router = useRouter();

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

        // fetch exhibition details if exhibitionId is present
        if (fetchedArtwork.exhibitionId) {
          fetchExhibitionFromFirebase(fetchedArtwork.exhibitionId);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("error fetching artwork", error);
    }
  };

  const fetchExhibitionFromFirebase = async (exhibitionId: string) => {
    try {
      const fetchedExhibition = await exhibitionApi.getExhibitionById(
        exhibitionId
      );

      console.log("fetched exhibition:", fetchedExhibition);

      if (fetchedExhibition) {
        setExhibition(fetchedExhibition);
      }
    } catch (error) {
      console.log("error fetching exhibition", error);
    }
  };

  const goToExhibitionOnMap = () => {
    if (exhibition) {
      router.push({
        pathname: "/map",
        params: {
          exhibition: JSON.stringify(exhibition),
        },
      });
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
      setIsLoadingComments(true);
      // fetch comments from firestore
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

          // fetch the newly added comment only and append it to the comments list
          const newComment = await commentApi.getCommentsByIds([newCommentId]);
          if (newComment) {
            setComments((prevComments) => [...prevComments, ...newComment]);
          }
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

  const handleDeleteComment = async (commentId: string) => {
    try {
      if (artwork) {
        setDeletingCommentId(commentId);

        // delete the comment
        await commentApi.deleteComment(commentId, artwork?.id);
        console.log("Comment deleted");

        // update state to remove deleted comment
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      console.log("Error deleting comment", error);
    } finally {
      setDeletingCommentId(null); // reset after deletion
    }
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
      <View className="flex-1 px-4 mb-6">
        {artwork ? (
          <>
            <ArtworkCard
              artwork={artwork}
              isLiked={isLiked}
              numLikes={numLikes}
              toggleLike={toggleLike}
              textSize={textSize}
            />
            {artwork.artistId === user?.uid && (
              <Pressable
                onPress={handleDeleteArtwork}
                className="bg-red-500 p-2 my-2 rounded self-start"
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

            {/* show button to navigate to mapScreen if there is an exhibition related to the artwork */}
            {exhibition && (
              <View className="mt-4 p-4 bg-gray-300 rounded-lg">
                <Text className="text-xl font-semibold text-gray-800 mb-2">
                  Exhibition: {exhibition.title}
                </Text>
                <Text className="text-md text-gray-600">
                  Location: {exhibition.location}
                </Text>
                <Text className="text-md text-gray-600">
                  Dates: {exhibition.startDate} - {exhibition.endDate}
                </Text>
                <TouchableOpacity
                  className="px-4 py-2 mt-4 bg-gray-700 rounded self-start"
                  onPress={goToExhibitionOnMap}
                >
                  <Text className="text-white font-bold">
                    View exhibition on map
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <Text
            style={{ textAlign: "center", color: "#555", fontSize: textSize }}
          >
            Artwork not found.
          </Text>
        )}

        {/* comments */}
        <View className="mt-4 p-4 bg-gray-300 rounded-lg">
          <View>
            <Text className="text-lg mb-2 font-bold">Comments</Text>
            <View>
              {isLoadingComments ? (
                <ActivityIndicator />
              ) : (
                comments.map((comment) => (
                  // each individual comment
                  <View
                    key={comment.id}
                    className="flex-row py-2 border-b border-gray-300"
                  >
                    {deletingCommentId === comment.id ? (
                      // show loading indicator when deleting a comment
                      <ActivityIndicator size="small" color="#ff0000" />
                    ) : (
                      <>
                        <Text className="font-bold mr-2">
                          {comment.comment?.artistName ?? ""}
                        </Text>
                        <Text className="flex-1">
                          {comment.comment?.comment ?? ""}
                        </Text>

                        {comment.comment.artistId === user?.uid && (
                          <TouchableOpacity
                            onPress={() => handleDeleteComment(comment.id)}
                          >
                            <FontAwesome name="trash" size={20} color="red" />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>

          {/* add comment section */}
          {/* only show if comments is not loading */}
          {!isLoadingComments && (
            <View className="flex-row items-center w-full mt-4">
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor="gray"
                className="flex-1 border-b border-gray-400 p-2 mr-2"
              />

              <TouchableOpacity
                onPress={handleAddComment}
                disabled={isLoadingAddComment}
                className="px-4 py-2 bg-blue-500 rounded"
              >
                {isLoadingAddComment ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Add</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
