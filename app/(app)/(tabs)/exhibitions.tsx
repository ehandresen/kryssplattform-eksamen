import { useExhibition } from "@/hooks/useExhibition";
import { Exhibition } from "@/types/exhibition";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

/**
 * ExhibitionScreen er en skjerm som viser en liste over utstillinger.
 * Den henter data ved hjelp av `useExhibition`-hooken, håndterer lastetilstand
 * og presenterer en liste over utstillinger med lenker til detaljsiden.
 */
const ExhibitionScreen = () => {
  // Bruker custom hook for å hente utstillinger
  const { exhibitions, isLoading } = useExhibition();

  /**
   * Viser en lastingsindikator når dataene hentes.
   */
  if (isLoading) {
    console.log("Loading exhibitions..."); // Debugging
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Laster utstillinger...</Text>
      </View>
    );
  }

  /**
   * Hvis det ikke er noen utstillinger, viser en tom liste-melding.
   */
  const renderEmptyList = () => (
    <Text style={styles.emptyText}>Ingen utstillinger tilgjengelig.</Text>
  );

  /**
   * Renderer hver enkelt utstilling i listen.
   * @param item Utstillingsdata
   */
  const renderExhibition = ({ item }: { item: Exhibition }) => {
    try {
      // Debugging: Logger utstillingsdata for å sikre korrekt innhold
      console.log("Rendering exhibition:", item);

      return (
        <TouchableOpacity style={styles.exhibitionCard}>
          <Link
            href={{
              pathname: "/exhibitionDetails/[id]",
              params: { id: item.id },
            }}
          >
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.date}>
                {item.startDate} - {item.endDate}
              </Text>
            </View>
          </Link>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error("Feil ved rendering av utstilling:", error); // Feilhåndtering
      return null;
    }
  };

  /**
   * Returnerer hovedkomponenten som inneholder utstillingslisten.
   */
  return (
    <FlatList
      data={exhibitions}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmptyList}
      contentContainerStyle={styles.listContainer}
      renderItem={renderExhibition}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Lys bakgrunn under lasting
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333", // Mørk grå tekst
  },
  listContainer: {
    padding: 16,
    backgroundColor: "#ffffff", // Hvit bakgrunn for listen
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999", // Lys grå tekst for tom liste
  },
  exhibitionCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f0f0f0", // Lys grå bakgrunn for kort
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Mørk grå titteltekst
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666", // Medium grå lokasjonstekst
  },
  date: {
    fontSize: 12,
    color: "#999", // Lys grå datotekst
    marginTop: 4,
  },
});

export default ExhibitionScreen;
