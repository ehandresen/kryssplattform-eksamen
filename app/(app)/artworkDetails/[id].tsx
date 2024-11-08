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

  const { id } = useLocalSearchParams();
  const { session } = useAuth();

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

  const handleAddComment = async () => {
    if (artwork && commentText !== "") {
      setIsLoadingAddComment(true);
      // todo add context for artist data?
      await commentApi.addComment(artwork.id, {
        artistId: "artistId",
        artistName: session as string,
        comment: commentText,
      });

      setCommentText("");
      setIsLoadingAddComment(false);
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
      <View className="flex-1 p-4">
        {artwork ? (
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
                  <Text>{comment.comment.comment}</Text>
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

          {/* // todo extract button for reusability? */}
          {/* add button */}
          <Pressable
            onPress={handleAddComment}
            disabled={isLoadingAddComment} // disable button to prevent duplicate adding of comment
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
