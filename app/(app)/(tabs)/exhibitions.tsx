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
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg text-gray-700">
          Laster utstillinger...
        </Text>
      </View>
    );
  }

  /**
   * Hvis det ikke er noen utstillinger, viser en tom liste-melding.
   */
  const renderEmptyList = () => (
    <Text className="text-center text-lg text-gray-400">
      Ingen utstillinger tilgjengelig.
    </Text>
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
        <TouchableOpacity className="p-4 mb-3 bg-gray-100 rounded-lg shadow-md">
          <Link
            href={{
              pathname: "/exhibitionDetails/[id]",
              params: { id: item.id },
            }}
          >
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600">{item.location}</Text>
              <Text className="text-xs text-gray-500 mt-1">
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
      renderItem={renderExhibition}
    />
  );
};

export default ExhibitionScreen;
