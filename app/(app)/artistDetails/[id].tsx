import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getArtistById } from "@/api/artistApi"; // Henter informasjon om en spesifikk artist
import { getAllArtworks } from "@/api/artworkApi"; // Henter alle kunstverk
import ArtistCard from "@/components/ArtistCard"; // Kortkomponent for artist
import ArtworkList from "@/components/ArtworkList"; // Listekomponent for kunstverk
import { useAccessibility } from "@/hooks/useAccessibility"; // Tilgjengelighetshook
import { Artist } from "@/types/artist"; // Typedefinisjon for artist
import { Artwork } from "@/types/artwork"; // Typedefinisjon for kunstverk

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

  /**
   * Viser en lasteskjerm mens data hentes.
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentColors.secondary} />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
          Laster data...
        </Text>
      </View>
    );
  }

  /**
   * Viser en feilmelding hvis det oppstår en feil under henting av data.
   */
  if (error) {
    return (
      <View style={styles.container}>
        <Text
          style={[styles.errorText, { color: currentColors.error || "#f00" }]}
        >
          {error}
        </Text>
      </View>
    );
  }

  /**
   * Viser en melding hvis artisten ikke finnes.
   */
  if (!artist) {
    return (
      <View style={styles.container}>
        <Text
          style={[styles.errorText, { color: currentColors.error || "#f00" }]}
        >
          Fant ingen artist.
        </Text>
      </View>
    );
  }

  /**
   * Returnerer brukergrensesnittet for artistens detaljer og deres kunstverk.
   */
  return (
    <View style={styles.container}>
      {/* Viser artistens detaljer */}
      <ArtistCard
        artist={artist}
        onPress={() => {}} // Ingen handling for trykk i detaljvisning
        textSize={16}
      />

      {/* Viser en liste over artistens kunstverk */}
      <View style={styles.artworksContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: currentColors.primary, fontSize: textSize },
          ]}
        >
          Kunstverk av {artist.displayName}
        </Text>
        <ArtworkList data={artworks} textSize={textSize} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Standard bakgrunnsfarge
    padding: 16, // Innvendig marg
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center", // Sentraliserer innholdet vertikalt
    alignItems: "center", // Sentraliserer innholdet horisontalt
  },
  errorText: {
    fontSize: 18, // Størrelse på feilmeldinger
    textAlign: "center", // Sentrerer teksten
  },
  artworksContainer: {
    marginTop: 16, // Avstand fra toppen
  },
  sectionTitle: {
    fontSize: 20, // Tittelstørrelse
    fontWeight: "bold", // Fet tekst
    marginBottom: 8, // Avstand til neste element
  },
});
