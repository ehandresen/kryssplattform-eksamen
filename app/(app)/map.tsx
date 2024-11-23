/**
 * MapScreen viser et kart med informasjon om en exhibition basert på
 * ruteparametere. Støtter både web og mobil plattformer.
 */

import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Alert, Text, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import WebMap from "@teovilla/react-native-web-maps";

const GOOGLE_API_KEY = "AIzaSyC7buBoSMkXfSord-JMfBknaizdwB5CuPs";

const MapScreen = () => {
  // Henter data om exhibition fra ruteparametrene
  const { exhibition } = useLocalSearchParams();

  // Konverterer JSON-strengen til et Exhibition-objekt
  const exhibitionData: Exhibition | null = exhibition
    ? JSON.parse(exhibition as string)
    : null;

  // Håndterer trykk på markør
  const handleMarkerPress = () => {
    if (exhibitionData) {
      Alert.alert(
        "Exhibition",
        `Du trykket på ${exhibitionData.title}\nLokasjon: ${exhibitionData.location}`
      );
    }
  };

  /**
   * Viser kart for web-plattformen.
   */
  if (Platform.OS === "web") {
    return (
      <View className="flex-1">
        {exhibitionData && (
          // Viser kart med utgangspunkt i exhibition-data
          // @ts-ignore: Typescript klager men det fungerer

          <WebMap
            provider="google"
            initialRegion={{
              latitude: exhibitionData.coordinates.latitude,
              longitude: exhibitionData.coordinates.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            googleMapsApiKey={GOOGLE_API_KEY}
            style={{
              width: "100%",
              height: "100%",
            }}
          ></WebMap>
        )}
      </View>
    );
  }

  /**
   * Viser kart for andre plattformer enn web.
   */
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
          {/* Markør som representerer exhibition */}
          <Marker
            coordinate={exhibitionData.coordinates}
            title={exhibitionData.title}
            description={exhibitionData.location}
            onPress={handleMarkerPress}
          />
        </MapView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>Ingen exhibition-data tilgjengelig!</Text>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
