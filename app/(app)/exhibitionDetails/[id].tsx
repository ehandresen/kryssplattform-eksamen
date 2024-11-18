import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import { useExhibition } from "@/hooks/useExhibition";

/**
 * Komponent for å vise detaljer om en utstilling.
 */
export default function ExhibitionDetails() {
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
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg text-gray-700">
          Laster utstillingsdata...
        </Text>
      </View>
    );
  }

  /**
   * Viser en feilmelding hvis utstillingen ikke finnes.
   */
  if (!exhibition) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-600">Fant ingen utstilling.</Text>
      </View>
    );
  }

  /**
   * Returnerer brukergrensesnittet for utstillingens detaljer.
   */
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-3">
        {exhibition.title}
      </Text>
      <Text className="text-xl text-gray-600 mb-2">{exhibition.location}</Text>
      <Text className="text-lg text-gray-500">
        {exhibition.startDate} - {exhibition.endDate}
      </Text>
    </View>
  );
}
