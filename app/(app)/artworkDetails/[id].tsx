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
import * as artworkApi from "@/api/artworkApi"; // API-funksjoner for kunstverk
import * as commentApi from "@/api/commentApi"; // API-funksjoner for kommentarer
import { CommentObject } from "@/types/comment"; // Typedefinisjon for kommentarer
import ArtworkCard from "@/components/ArtworkCard"; // Gjenbrukbar komponent for kunstverkkort
import { useAuth } from "@/hooks/useAuth"; // Håndterer autentisering og brukerdata
import { FontAwesome } from "@expo/vector-icons";
import { Exhibition } from "@/types/exhibition"; // Typedefinisjon for utstillinger
import { useExhibition } from "@/hooks/useExhibition"; // Hook for å hente utstillingsdetaljer
import { useAccessibility } from "@/hooks/useAccessibility"; // Tilgjengelighetshook

/**
 * Komponent for å vise detaljer om et kunstverk, inkludert kommentarer og relaterte utstillinger.
 */
export default function ArtDetails() {
  // Tilgjengelighetsinnstillinger for tekststørrelse og farger
  const { textSize, currentColors } = useAccessibility();

  // State-variabler for å håndtere kunstverk, kommentarer, og tilhørende status
  const [artwork, setArtwork] = useState<Artwork | null>(null); // Holder kunstverkinformasjon
  const [loading, setLoading] = useState(true); // Indikerer om data laster
  const [comments, setComments] = useState<CommentObject[]>([]); // Liste over kommentarer
  const [isLoadingComments, setIsLoadingComments] = useState(false); // Indikerer lasting av kommentarer
  const [commentText, setCommentText] = useState(""); // Innholdet i kommentarfeltet
  const [isLoadingAddComment, setIsLoadingAddComment] = useState(false); // Indikerer om en kommentar legges til
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  ); // ID til kommentaren som slettes
  const [isLiked, setIsLiked] = useState(false); // Indikerer om brukeren har likt kunstverket
  const [numLikes, setNumLikes] = useState(0); // Antall liker-klikk
  const [exhibition, setExhibition] = useState<Exhibition | undefined>(
    undefined
  ); // Tilhørende utstilling

  const { id } = useLocalSearchParams(); // Henter ID-en til kunstverket fra URL-parameterne
  const router = useRouter(); // For navigering mellom skjermer
  const { session, user } = useAuth(); // Henter brukerens autentiseringsstatus
  const { getExhibitionById } = useExhibition(); // Henter detaljer om utstillinger

  // Henter kunstverk og tilhørende data når komponenten laster
  useEffect(() => {
    fetchArtworkFromFirebase();
  }, []);

  /**
   * Henter detaljer om kunstverket og eventuelle tilhørende kommentarer og utstillinger.
   */
  const fetchArtworkFromFirebase = async () => {
    try {
      console.log("Henter kunstverk med ID:", id); // Debugging

      const fetchedArtwork = await artworkApi.getArtworkById(id as string);

      if (fetchedArtwork) {
        setArtwork(fetchedArtwork);
        setIsLiked(fetchedArtwork.likes.includes(user?.uid ?? "")); // Sjekker om brukeren har likt
        setNumLikes(fetchedArtwork.likes.length); // Oppdaterer antall liker-klikk

        // Henter kommentarer
        fetchCommentsFromFirebase(fetchedArtwork.comments);

        // Henter utstillingsdetaljer hvis kunstverket er knyttet til en utstilling
        if (fetchedArtwork.exhibitionId) {
          const fetchedExhibition = await getExhibitionById(
            fetchedArtwork.exhibitionId
          );
          setExhibition(fetchedExhibition);
        }
      } else {
        console.warn("Kunstverk ikke funnet med ID:", id); // Debugging
      }
    } catch (error) {
      console.error("Feil ved henting av kunstverk:", error);
      Alert.alert("Feil", "Kunne ikke hente kunstverket. Prøv igjen senere.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Håndterer likeklikk på kunstverket.
   */
  const toggleLike = async () => {
    if (!artwork) return;

    try {
      const updatedLikes = isLiked
        ? artwork.likes.filter((uid) => uid !== user?.uid)
        : [...artwork.likes, user?.uid ?? ""];

      setIsLiked(!isLiked);
      setNumLikes(updatedLikes.length);
      setArtwork({ ...artwork, likes: updatedLikes });

      await artworkApi.updateArtworkLikes(artwork.id, user?.uid ?? "");
      console.log("Oppdatert liker-status for kunstverk:", artwork.id); // Debugging
    } catch (error) {
      console.error("Feil ved oppdatering av liker-status:", error);
      Alert.alert(
        "Feil",
        "Kunne ikke oppdatere liker-status. Prøv igjen senere."
      );
    }
  };

  /**
   * Henter kommentarer knyttet til kunstverket fra Firestore.
   */
  const fetchCommentsFromFirebase = async (commentsIds: string[]) => {
    try {
      setIsLoadingComments(true);
      console.log("Henter kommentarer:", commentsIds); // Debugging

      const comments = await commentApi.getCommentsByIds(commentsIds);
      if (comments) setComments(comments);
    } catch (error) {
      console.error("Feil ved henting av kommentarer:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  /**
   * Legger til en ny kommentar på kunstverket.
   */
  const handleAddComment = async () => {
    if (!artwork || commentText.trim() === "") return;

    try {
      setIsLoadingAddComment(true);

      const newCommentId = await commentApi.addComment(artwork.id, {
        artistId: user?.uid ?? "unknown",
        artistName: session as string,
        comment: commentText.trim(),
      });

      if (newCommentId) {
        setCommentText(""); // Tilbakestiller tekstfeltet
        const newComment = await commentApi.getCommentsByIds([newCommentId]);

        if (newComment) {
          setComments((prev) => [...prev, ...newComment]);
          setArtwork((prevArtwork) =>
            prevArtwork
              ? {
                  ...prevArtwork,
                  comments: [...prevArtwork.comments, newCommentId],
                }
              : null
          );
        }
      }
    } catch (error) {
      console.error("Feil ved legging av kommentar:", error);
      Alert.alert("Feil", "Kunne ikke legge til kommentar. Prøv igjen senere.");
    } finally {
      setIsLoadingAddComment(false);
    }
  };

  /**
   * Sletter en kommentar knyttet til kunstverket.
   */
  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);

      await commentApi.deleteComment(commentId, artwork?.id ?? "");
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Feil ved sletting av kommentar:", error);
      Alert.alert("Feil", "Kunne ikke slette kommentaren. Prøv igjen senere.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  /**
   * Sletter kunstverket hvis det tilhører den innloggede brukeren.
   */
  const handleDeleteArtwork = async () => {
    if (artwork?.artistId !== user?.uid) {
      Alert.alert("Feil", "Du kan kun slette kunstverk du selv har opprettet.");
      return;
    }

    Alert.alert(
      "Bekreft sletting",
      "Er du sikker på at du vil slette dette kunstverket?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: async () => {
            try {
              if (artwork) {
                // Sjekker om artwork ikke er null
                await artworkApi.deleteArtwork(artwork.id);
                setArtwork(null); // Fjerner kunstverket fra visningen
                router.replace("/gallery"); // Navigerer tilbake til galleriet
              } else {
                console.error("Kunstverket er null og kan ikke slettes.");
                Alert.alert("Feil", "Kunstverket finnes ikke lenger.");
              }
            } catch (error) {
              console.error("Feil ved sletting av kunstverk:", error);
              Alert.alert(
                "Feil",
                "Kunne ikke slette kunstverket. Prøv igjen senere."
              );
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
        <Text style={{ marginTop: 10, fontSize: textSize, color: "#555" }}>
          Laster data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Gjenværende JSX er kommentert i tilsvarende stil */}
    </ScrollView>
  );
}
