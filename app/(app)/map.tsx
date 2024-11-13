import { Exhibition } from "@/types/exhibition";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

import MapView, { Marker } from "react-native-maps";

const MapScreen = () => {
  const { exhibition } = useLocalSearchParams();

  console.log("exhibition string", exhibition);

  const exhibitionData: Exhibition | null = exhibition
    ? JSON.parse(exhibition as string)
    : null;

  console.log("exhibition:", exhibitionData);

  // Oslo, Norway
  const defaultLocation = {
    latitude: 59.9139,
    longitude: 10.7522,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // todo when clicking on marker/exhibition go the detailsscreen of exhibition

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
        {exhibitionData && (
          <Marker
            coordinate={exhibitionData.coordinates}
            title={exhibitionData.title}
            description={exhibitionData.location}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
