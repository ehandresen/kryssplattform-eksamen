import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import { useExhibition } from "@/hooks/useExhibition";

/**
 * Komponent for å vise detaljer om en utstilling.
 */
const ExhibitionDetails = () => {
  // Henter utstillings-ID fra ruteparametrene
  const { id } = useLocalSearchParams();

  // State for å holde data om utstillingen
  const [exhibition, setExhibition] = useState<Exhibition | undefined>(
    undefined
  );

  // State for å indikere om data fortsatt laster
  const [loading, setLoading] = useState(true);

  // Funksjon for å hente utstilling fra context-hook
  const { getExhibitionById } = useExhibition();

  /**
   * useEffect kjører når komponenten rendres og henter data for utstillingen.
   */
  useEffect(() => {
    fetchExhibition();
  }, [id]);

  /**
   * Funksjon for å hente utstilling fra databasen basert på ID.
   * Lagrer utstillingen i state eller logger feil hvis noe går galt.
   */
  const fetchExhibition = async () => {
    try {
      console.log("Henter utstilling med ID:", id); // Debugging

      // Hent data om utstillingen
      const fetchedExhibition = await getExhibitionById(id as string);

      if (fetchedExhibition) {
        console.log("Utstilling hentet:", fetchedExhibition); // Debugging
        setExhibition(fetchedExhibition);
      } else {
        console.warn("Ingen utstilling funnet for ID:", id); // Feilhåndtering
      }
    } catch (error) {
      console.error("Feil ved henting av utstilling:", error); // Feilhåndtering
    } finally {
      setLoading(false); // Sørger for at lastindikator stopper
    }
  };

  /**
   * Returnerer en lasteskjerm mens data hentes.
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Laster utstillingsdata...</Text>
      </View>
    );
  }

  /**
   * Viser en melding hvis utstillingen ikke finnes.
   */
  if (!exhibition) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Fant ingen utstilling.</Text>
      </View>
    );
  }

  /**
   * Returnerer brukergrensesnittet for utstillingens detaljer.
   */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exhibition.title}</Text>
      <Text style={styles.location}>{exhibition.location}</Text>
      <Text style={styles.dates}>
        {exhibition.startDate} - {exhibition.endDate}
      </Text>
    </View>
  );
};

// Styling for komponenten
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff", // Bakgrunnsfarge
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center", // Sentraliserer innhold vertikalt
    alignItems: "center", // Sentraliserer innhold horisontalt
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555", // Grå tekstfarge
  },
  title: {
    fontSize: 24, // Tittelstørrelse
    fontWeight: "bold", // Fet skrift
    color: "#333", // Mørk tekstfarge
    marginBottom: 8, // Avstand til neste element
  },
  location: {
    fontSize: 18, // Størrelse på tekst for lokasjon
    color: "#666", // Middels grå farge
    marginBottom: 4, // Avstand til neste element
  },
  dates: {
    fontSize: 16, // Størrelse på tekst for datoer
    color: "#999", // Lys grå farge
  },
  errorText: {
    fontSize: 18, // Størrelse på feilmeldinger
    color: "red", // Rød tekstfarge
    textAlign: "center", // Sentrer teksten
  },
});

export default ExhibitionDetails;
