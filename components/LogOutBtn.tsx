// LogOutBtn.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const LogOutBtn = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text style={styles.logoutText}>Log{"\n"}out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    alignItems: "center", // Center the text within the button
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    textAlign: "center", // Center the text within the Text component
  },
});

export default LogOutBtn;
