/**
 * Viser detaljer om et artwork, inkludert kommentarer, liker-status og utstillingsinformasjon.
 */

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
import { useAccessibility } from "@/hooks/useAccessibility";
import { useArtwork } from "@/hooks/useArtwork";
import Toast from "react-native-toast-message";

export default function ArtDetails() {
  // Tilgjengelighetsinnstillinger
  const { textSize, currentColors } = useAccessibility();

  // State-håndtering
  // - Artwork-data og tilknyttet informasjon
  // - Kommentarer og liker-status
  // - Utstillingsdata
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
  const [isDeletingArtwork, setIsDeletingArtwork] = useState(false);

  // Henter URL-parametere og router for navigasjon
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Håndterer autentisering og tilgang til utstillingsdata
  const { session, user, role } = useAuth();
  const { getExhibitionById } = useExhibition();
  const { deleteArtwork } = useArtwork();

  /**
   * Henter detaljer om artwork og tilknyttede data.
   * - Inkluderer kommentarer, liker-status og exhibition hvis aktuelt.
   */
  const fetchArtworkFromFirebase = async () => {
    try {
      const fetchedArtwork = await artworkApi.getArtworkById(id as string);

      if (fetchedArtwork) {
        setArtwork(fetchedArtwork);
        setIsLiked(fetchedArtwork.likes.includes(user?.uid ?? ""));
        setNumLikes(fetchedArtwork.likes.length);
        fetchCommentsFromFirebase(fetchedArtwork.comments);

        // Hent tilknyttet exhibition om tilgjengelig
        if (
          fetchedArtwork.exhibitionId &&
          fetchedArtwork.exhibitionId !== "undefined"
        ) {
          const fetchedExhibition = await getExhibitionById(
            fetchedArtwork.exhibitionId
          );
          setExhibition(fetchedExhibition);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching artwork:", error);
    }
  };

  /**
   * Initialiserer data ved første lasting.
   */
  useEffect(() => {
    fetchArtworkFromFirebase();
  }, []);

  /**
   * Navigerer til kartskjermen for å vise exhibitiondetaljer.
   */
  const goToExhibitionOnMap = () => {
    if (exhibition) {
      router.push({
        pathname: "/map",
        params: { exhibition: JSON.stringify(exhibition) },
      });
    }
  };
  /**
   * Håndterer liker-funksjonalitet.
   * - Oppdaterer lokal liker-status og antall liker.
   * - Synkroniserer endringer med Firebase.
   */
  const toggleLike = async () => {
    if (!artwork) return;

    const updatedLikes = isLiked
      ? artwork.likes.filter((uid) => uid !== user?.uid)
      : [...artwork.likes, user?.uid ?? ""];

    setIsLiked(!isLiked);
    setNumLikes(updatedLikes.length);
    setArtwork({ ...artwork, likes: updatedLikes });

    try {
      // Oppdaterer likes på Firebase
      await artworkApi.updateArtworkLikes(artwork.id, user?.uid ?? "");
    } catch (error) {
      console.log("Error updating likes:", error);
    }
  };

  /**
   * Henter kommentarer fra Firebase basert på kommentar-ID-er.
   * - Oppdaterer state med de hentede kommentarene.
   */
  const fetchCommentsFromFirebase = async (commentsIds: string[]) => {
    try {
      setIsLoadingComments(true);
      const comments = await commentApi.getCommentsByIds(commentsIds);

      if (comments) {
        setComments(comments);
      }
      setIsLoadingComments(false);
    } catch (error) {
      console.log("error fetching comments", error);
    }
  };

  /**
   * Legger til en ny kommentar.
   * - Validerer at kommentarfeltet ikke er tomt.
   * - Oppdaterer Firebase og lokal state med den nye kommentaren.
   */
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

          // Henter og legger til den nylig kommentaren
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

  /**
   * Håndterer sletting av artwork.
   * - Sjekker at brukeren eier artwork før sletting.
   * - Viser en bekreftelsesdialog før artwork slettes fra Firebase.
   */
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
            setIsDeletingArtwork(true);
            try {
              if (artwork) {
                await deleteArtwork(artwork.id);
                setArtwork(null);

                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "The artwork has been deleted.",
                });
                router.push("/gallery");
              }
            } catch (error) {
              console.error("Error deleting artwork:", error);
            } finally {
              setIsDeletingArtwork(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Håndterer sletting av kommentar.
   * - Fjerner kommentaren fra Firebase og oppdaterer lokal state.
   */
  const handleDeleteComment = async (commentId: string) => {
    try {
      if (artwork) {
        setDeletingCommentId(commentId);

        await commentApi.deleteComment(commentId, artwork?.id);

        // Oppdaterer kommentarliste etter sletting
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      console.log("Error deleting comment", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  /**
   * Viser en melding for gjestebrukere.
   * - Krever innlogging for å få tilgang til artworkdetaljer.
   */
  if (role === "guest") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-600 text-center">
          Du må være logget inn for å se kunstverk.
        </Text>
      </View>
    );
  }

  /**
   * Viser en lastesirkel under lasting eller sletting av artwork.
   */
  if (loading || isDeletingArtwork) {
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
            {/* Viser artwork card med informasjon, liker-status og antall liker */}
            <ArtworkCard
              artwork={artwork}
              isLiked={isLiked}
              numLikes={numLikes}
              toggleLike={toggleLike}
            />
            {/* Hvis artwork er opprettet av den nåværende brukeren, vis en knapp for å slette */}
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

            {/* Viser exhibitionsdetaljer hvis artwork har en tilknyttet utstilling */}
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
                  onPress={goToExhibitionOnMap}
                >
                  <Text className="text-white font-bold">
                    View exhibition on map
                  </Text>
                </TouchableOpacity>
              </View>
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
                                <FontAwesome
                                  name="trash"
                                  size={20}
                                  color="red"
                                />
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
                    disabled={isLoadingAddComment}
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
          </>
        ) : (
          // Hvis artworks ikke finnes, vises en feilmelding
          <Text
            style={{ textAlign: "center", color: "#555", fontSize: textSize }}
          >
            Artwork not found.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
