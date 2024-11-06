import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Header
        subtitle="Map"
        showProfileButton={true}
        navigateHomeOnBack={true}
      />
      {/* Map content goes here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
