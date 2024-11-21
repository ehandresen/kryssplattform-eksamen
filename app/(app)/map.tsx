import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Alert, Text, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import WebMap from "@teovilla/react-native-web-maps";

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

  if (Platform.OS === "web") {
    return (
      // @ts-ignore: Typescript klager men det fungerer
      <WebMap
        provider="google"
        initialRegion={{
          latitude: exhibitionData.coordinates.latitude,
          longitude: exhibitionData.coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        googleMapsApiKey="Din nøkkel her"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></WebMap>
    );
  }
  return (
    <View className="flex-1">
      {exhibitionData ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: exhibitionData.coordinates.latitude,
            longitude: exhibitionData.coordinates.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Legger til markør hvis utstillingsdata er tilgjengelig */}
          <Marker
            coordinate={exhibitionData.coordinates}
            title={exhibitionData.title}
            description={exhibitionData.location}
            onPress={handleMarkerPress} // Håndterer trykk på markøren
          />
        </MapView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>Ingen utstillingsdata tilgjengelig!</Text>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
