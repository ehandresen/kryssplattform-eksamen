import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Artwork } from "@/types/artwork";
import * as artworkApi from "@/api/artworkApi";
import * as commentApi from "@/api/commentApi";
import { CommentObject } from "@/types/comment";
import ArtworkCard from "@/components/gallery/ArtworkCard";
import { useAuth } from "@/hooks/useAuth";

export default function ArtDetails() {
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
      console.log("Fetching Artwork with ID:", id);
      const fetchedArtwork = await artworkApi.getArtworkById(id as string);
      console.log("Fetched Artwork:", fetchedArtwork);

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
        // add the new comment and get its ID
        const newCommentId = await commentApi.addComment(artwork.id, {
          artistId: user?.uid ?? "unknown",
          artistName: session as string,
          comment: commentText,
        });

        if (newCommentId) {
          setCommentText("");

          // update artwork's comments array in state
          const updatedCommentsIds = [
            ...(artwork.comments || []),
            newCommentId,
          ];
          setArtwork({ ...artwork, comments: updatedCommentsIds });

          // fetch updated comments from firestore to include the new one
          await fetchCommentsFromFirebase(updatedCommentsIds);
        }
      } catch (error) {
        console.log("Error adding comment:", error);
      } finally {
        setIsLoadingAddComment(false);
      }
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
      <View className="flex-1 p-4 mb-6">
        {artwork ? (
          <ArtworkCard
            artwork={artwork}
            isLiked={isLiked}
            numLikes={numLikes}
            toggleLike={toggleLike}
          />
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
                    {comment.comment?.artistName ?? "Unknown Artist"}
                  </Text>
                  <Text className="flex-1">
                    {" "}
                    {comment.comment?.comment ?? "No comment text available"}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* add comment */}
        <View className="flex-row items-center w-full">
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="gray"
            className="flex-1 border-b border-gray-400 p-2 mr-2"
          />

          {/* TODO extract button for reusability */}
          <Pressable
            onPress={handleAddComment}
            disabled={isLoadingAddComment}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            {isLoadingAddComment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">Add</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
