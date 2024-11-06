import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";

export default function ArtistsScreen() {
  return (
    <View style={styles.container}>
      <Header
        subtitle="Artists"
        showProfileButton={true}
        navigateHomeOnBack={true}
      />
      {/* Artists content goes here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
