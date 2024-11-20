import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getArtistById } from "@/api/artistApi"; // Henter informasjon om en spesifikk artist
import { getAllArtworks } from "@/api/artworkApi"; // Henter alle kunstverk
import ArtistCard from "@/components/ArtistCard"; // Kortkomponent for artist
import ArtworkList from "@/components/ArtworkList"; // Listekomponent for kunstverk
import { useAccessibility } from "@/hooks/useAccessibility"; // Tilgjengelighetshook
import { Artist } from "@/types/artist"; // Typedefinisjon for artist
import { Artwork } from "@/types/artwork"; // Typedefinisjon for kunstverk
import { useAuth } from "@/hooks/useAuth";

/**
 * Komponent for å vise detaljert informasjon om en spesifikk artist, samt deres kunstverk.
 */
export default function ArtistDetails() {
  const { id } = useLocalSearchParams(); // Henter ID for artist fra ruteparametrene
  const { textSize, currentColors } = useAccessibility(); // Tilgjengelighetsinnstillinger for tekststørrelse og farger
  const [artist, setArtist] = useState<Artist | null>(null); // Holder informasjon om artisten
  const [artworks, setArtworks] = useState<Artwork[]>([]); // Holder kunstverk tilhørende artisten
  const [loading, setLoading] = useState(true); // Indikerer om data laster
  const [error, setError] = useState<string | null>(null); // Holder eventuelle feilmeldinger

  const { role } = useAuth();
  /**
   * Henter informasjon om artisten og deres kunstverk.
   */
  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      try {
        console.log("Henter detaljer for artist med ID:", id); // Debugging

        // Henter artistdata fra API
        const artistData = await getArtistById(id as string);
        if (!artistData || !artistData.id) {
          console.error("Fant ingen artist eller ugyldig ID:", artistData); // Debugging
          setError("Fant ingen artist med gitt ID.");
          setLoading(false);
          return;
        }

        setArtist(artistData);

        // Henter og filtrerer kunstverk basert på artistens ID
        const allArtworks = await getAllArtworks();
        const filteredArtworks = allArtworks.filter(
          (artwork) => artwork.artistId === id
        );

        console.log(
          `Fant ${filteredArtworks.length} kunstverk for artist med ID:`,
          id
        ); // Debugging
        setArtworks(filteredArtworks);
      } catch (error) {
        console.error("Feil ved henting av artist eller kunstverk:", error); // Debugging
        setError("En feil oppsto under henting av data.");
      } finally {
        setLoading(false); // Stopper lastindikatoren uansett
      }
    };

    fetchArtistAndArtworks();
  }, [id]);

  // Hvis bruker ikke er logget inn, hvis denne meldingen
  if (role === "guest") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-600 text-center">
          Du må være logget inn for å se artist detaljer.
        </Text>
      </View>
    );
  }

  /**
   * Viser en lasteskjerm mens data hentes.
   */
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color={currentColors.secondary} />
        <Text className="mt-2 text-lg text-gray-700">Laster data...</Text>
      </View>
    );
  }

  /**
   * Viser en feilmelding hvis det oppstår en feil under henting av data.
   */
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-600">{error}</Text>
      </View>
    );
  }

  /**
   * Viser en melding hvis artisten ikke finnes.
   */
  if (!artist) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-600">Fant ingen artist.</Text>
      </View>
    );
  }

  /**
   * Returnerer brukergrensesnittet for artistens detaljer og deres kunstverk.
   */
  return (
    <View className="flex-1 bg-white p-4">
      {/* Viser artistens detaljer */}
      <ArtistCard artist={artist} />

      {/* Viser en liste over artistens kunstverk */}
      <View className="flex-1 mt-4">
        <Text
          className="text-lg font-bold text-primary mb-3"
          style={{ fontSize: textSize }}
        >
          Kunstverk av {artist.displayName}
        </Text>
        <ArtworkList
          data={artworks}
          textSize={textSize}
          disableRefresh={true}
        />
      </View>
    </View>
  );
}
