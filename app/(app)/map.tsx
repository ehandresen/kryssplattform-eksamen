import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = () => {
  // Henter data om utstillingen fra ruteparametrene
  const { exhibition } = useLocalSearchParams();

  // Debugging: Logger den rå JSON-strengen for utstillingsdata
  console.log("Utstillingsdata (string):", exhibition);

  // Parser JSON-strengen til et Exhibition-objekt eller null hvis ingen data
  const exhibitionData: Exhibition | null = exhibition
    ? JSON.parse(exhibition as string)
    : null;

  // Debugging: Logger det parserte utstillingsobjektet
  console.log("Utstillingsobjekt:", exhibitionData);

  // Standard posisjon (Oslo, Norge)
  const defaultLocation = {
    latitude: 59.9139,
    longitude: 10.7522,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // Når man klikker på markøren, kan en advarsel vises som et eksempel
  const handleMarkerPress = () => {
    if (exhibitionData) {
      Alert.alert(
        "Utstilling",
        `Du trykket på ${exhibitionData.title}\nLokasjon: ${exhibitionData.location}`
      );
      // TODO: Naviger til detaljskjerm for utstillingen
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          exhibitionData
            ? {
                latitude: exhibitionData.coordinates.latitude,
                longitude: exhibitionData.coordinates.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : defaultLocation
        }
      >
        {/* Legger til markør hvis utstillingsdata er tilgjengelig */}
        {exhibitionData && (
          <Marker
            coordinate={exhibitionData.coordinates}
            title={exhibitionData.title}
            description={exhibitionData.location}
            onPress={handleMarkerPress} // Håndterer trykk på markøren
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Sørger for at beholderen fyller hele skjermen
  },
  map: {
    width: "100%", // Kartet fyller hele bredden
    height: "100%", // Kartet fyller hele høyden
  },
});

export default MapScreen;
