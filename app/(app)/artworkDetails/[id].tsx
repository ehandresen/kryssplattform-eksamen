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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Artwork } from "@/types/artwork";
import * as artworkApi from "@/api/artworkApi";
import * as commentApi from "@/api/commentApi";
import { CommentObject } from "@/types/comment";
import ArtworkCard from "@/components/ArtworkCard";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesome } from "@expo/vector-icons";
import { Exhibition } from "@/types/exhibition";
import MapScreen from "../map";
import { useExhibition } from "@/hooks/useExhibition";
import { useAccessibility } from "@/hooks/useAccessibility"; // Import the accessibility hook

export default function ArtDetails() {
  // Bruker tilpasset hook for tilgjengelighet (tekststørrelse og farger)
  const { textSize, currentColors } = useAccessibility();
  // Initialisering av state for kunstverk, kommentarer og andre nødvendige variabler
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
  const [exhibition, setExhibition] = useState<Exhibition | undefined>(
    undefined
  );

  const { id } = useLocalSearchParams(); // Henter ID fra URL-parametere
  const router = useRouter(); // Bruker router for navigering
  const { session, user } = useAuth(); // Henter autentiseringinformasjon
  const { getExhibitionById } = useExhibition(); // Henter informasjon om utstilling
  const fetchArtworkFromFirebase = async () => {
    try {
      // Henter kunstverk fra Firebase ved hjelp av kunstverk-ID
      const fetchedArtwork = await artworkApi.getArtworkById(id as string);

      if (fetchedArtwork) {
        setArtwork(fetchedArtwork);
        setIsLiked(fetchedArtwork.likes.includes(user?.uid ?? "")); // Sjekker om brukeren har likt kunstverket
        setNumLikes(fetchedArtwork.likes.length); // Oppdaterer antall liker
        fetchCommentsFromFirebase(fetchedArtwork.comments); // Henter kommentarer for kunstverket

        // Henter utstillingsdetaljer hvis kunstverket har en tilknyttet utstilling
        if (fetchedArtwork.exhibitionId) {
          const fetchedExhibition = await getExhibitionById(
            fetchedArtwork.exhibitionId
          );
          setExhibition(fetchedExhibition);
        }
      }
      setLoading(false);
    } catch (error) {
      // Feilhåndtering ved henting av kunstverk
      console.log("error fetching artwork", error);
    }
  };

  useEffect(() => {
    // Henter kunstverk og tilhørende data når komponenten lastes
    fetchArtworkFromFirebase();
  }, []); // Tom array betyr at effekten bare kjøres ved første render

  const goToExhibitionOnMap = () => {
    if (exhibition) {
      // Navigerer til kart-skjerm med utstillingsdetaljer
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
      ? artwork.likes.filter((uid) => uid !== user?.uid) // Fjerner liker hvis allerede likt
      : [...artwork.likes, user?.uid ?? ""]; // Legger til liker

    setIsLiked(!isLiked);
    setNumLikes(updatedLikes.length); // Oppdaterer antall liker
    setArtwork({ ...artwork, likes: updatedLikes }); // Oppdaterer kunstverkets data

    try {
      // Oppdaterer likes på Firebase
      await artworkApi.updateArtworkLikes(artwork.id, user?.uid ?? "");
    } catch (error) {
      console.log("Error updating likes:", error); // Feilhåndtering ved oppdatering
    }
  };

  const fetchCommentsFromFirebase = async (commentsIds: string[]) => {
    try {
      setIsLoadingComments(true);
      // Henter kommentarer fra Firebase
      const comments = await commentApi.getCommentsByIds(commentsIds);

      if (comments) {
        setComments(comments); // Setter kommentarer i state
      }
      setIsLoadingComments(false);
    } catch (error) {
      console.log("error fetching comments", error); // Feilhåndtering ved henting av kommentarer
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
          setCommentText(""); // Tømmer kommentarfeltet

          const updatedCommentsIds = [
            ...(artwork.comments || []),
            newCommentId,
          ];
          setArtwork({ ...artwork, comments: updatedCommentsIds }); // Oppdaterer kunstverkets kommentarer

          // Henter og legger til den nylig kommentaren
          const newComment = await commentApi.getCommentsByIds([newCommentId]);
          if (newComment) {
            setComments((prevComments) => [...prevComments, ...newComment]); // Oppdaterer kommentarliste
          }
        }
      } catch (error) {
        console.log("Error adding comment:", error); // Feilhåndtering ved legg til kommentar
      } finally {
        setIsLoadingAddComment(false); // Resetter lastestatus
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
                await artworkApi.deleteArtwork(artwork.id); // Sletter kunstverket
                setArtwork(null); // Nullstiller kunstverk
              }
            } catch (error) {
              console.error("Error deleting artwork:", error); // Feilhåndtering ved sletting
            }
          },
        },
      ]
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      if (artwork) {
        setDeletingCommentId(commentId); // Setter slettet kommentar-ID for tilbakemelding

        await commentApi.deleteComment(commentId, artwork?.id); // Sletter kommentaren
        console.log("Comment deleted");

        // Oppdaterer kommentarliste etter sletting
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      console.log("Error deleting comment", error); // Feilhåndtering ved sletting av kommentar
    } finally {
      setDeletingCommentId(null); // Nullstiller slettet kommentar-ID etter fullført prosess
    }
  };
  if (loading) {
    // Hvis dataene lastes, vises en lastesirkel
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
            {/* Viser kunstverkets kort med informasjon, liker-status og antall liker */}
            <ArtworkCard
              artwork={artwork}
              isLiked={isLiked}
              numLikes={numLikes}
              toggleLike={toggleLike}
              textSize={textSize} // Sender tekststørrelse til ArtworkCard for tilpasning
            />
            {/* Hvis kunstverket er opprettet av den nåværende brukeren, vis en knapp for å slette */}
            {artwork.artistId === user?.uid && (
              <Pressable
                onPress={handleDeleteArtwork}
                className="bg-red-500 p-2 my-2 rounded self-start"
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: textSize, // Bruker tekststørrelsen for konsistens
                    fontWeight: "bold",
                  }}
                >
                  Delete Artwork
                </Text>
              </Pressable>
            )}

            {/* Viser utstillingsdetaljer hvis kunstverket har en tilknyttet utstilling */}
            {exhibition && (
              <View className="mt-4 p-4 bg-gray-300 rounded-lg">
                <Text
                  className="text-xl font-semibold text-gray-800 mb-2"
                  style={{ fontSize: textSize + 4 }}
                >
                  Exhibition: {exhibition.title}
                </Text>
                <Text
                  className="text-md text-gray-600"
                  style={{ fontSize: textSize }}
                >
                  Location: {exhibition.location}
                </Text>
                <Text
                  className="text-md text-gray-600"
                  style={{ fontSize: textSize }}
                >
                  Dates: {exhibition.startDate} - {exhibition.endDate}
                </Text>
                <TouchableOpacity
                  className="px-4 py-2 mt-4 bg-gray-700 rounded self-start"
                  onPress={goToExhibitionOnMap} // Navigerer til kartet med utstillingens posisjon
                >
                  <Text className="text-white font-bold">
                    View exhibition on map
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          // Hvis kunstverket ikke finnes, vises en feilmelding
          <Text
            style={{ textAlign: "center", color: "#555", fontSize: textSize }}
          >
            Artwork not found.
          </Text>
        )}

        {/* Kommentarer-seksjonen */}
        <View className="mt-4 p-4 bg-gray-300 rounded-lg">
          <View>
            <Text
              className="text-lg mb-2 font-bold"
              style={{ fontSize: textSize + 2 }}
            >
              Comments
            </Text>
            <View>
              {/* Hvis kommentarer lastes, vis lastesirkel */}
              {isLoadingComments ? (
                <ActivityIndicator />
              ) : (
                comments.map((comment) => (
                  // Viser hver individuell kommentar
                  <View
                    key={comment.id}
                    className="flex-row py-2 border-b border-gray-300"
                  >
                    {deletingCommentId === comment.id ? (
                      // Vis lastesirkel når kommentar slettes
                      <ActivityIndicator size="small" color="#ff0000" />
                    ) : (
                      <>
                        {/* Viser kommentarens forfatter og tekst */}
                        <Text
                          className="font-bold mr-2"
                          style={{ fontSize: textSize }}
                        >
                          {comment.comment?.artistName ?? ""}
                        </Text>
                        <Text
                          className="flex-1"
                          style={{ fontSize: textSize - 2 }}
                        >
                          {comment.comment?.comment ?? ""}
                        </Text>

                        {/* Vist søppelbøtte-ikon for sletting av kommentar hvis eier */}
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

          {/* Seksjon for å legge til kommentar */}
          {!isLoadingComments && (
            <View className="flex-row items-center w-full mt-4">
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor="gray"
                className="flex-1 border-b border-gray-400 p-2 mr-2"
                style={{ fontSize: textSize }}
              />

              <TouchableOpacity
                onPress={handleAddComment}
                disabled={isLoadingAddComment} // Deaktiverer knappen hvis kommentaren legges til
                className="px-4 py-2 bg-blue-500 rounded"
              >
                {isLoadingAddComment ? (
                  // Vist lastesirkel mens kommentaren legges til
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: textSize }}
                  >
                    Add
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
