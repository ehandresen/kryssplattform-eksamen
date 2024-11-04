// app/index.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Set a timer to navigate to the authentication screen after 3 seconds
    const timer = setTimeout(() => {
      router.push("/(app)/authentication");
    }, 3000); // Adjust the duration (in milliseconds) as needed

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to ArtVista</Text>
      <Text style={styles.subText}>Redirecting to login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "gray",
  },
});
