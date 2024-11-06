import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth"; // Use the useAuth hook for context access

const LogOutBtn = () => {
  const router = useRouter();
  const { signOut } = useAuth(); // Use signOut from AuthContext

  const handlePress = async () => {
    try {
      await signOut(); // Sign the user out of Firebase
      router.push("/"); // Redirect to the main screen after signing out
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
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
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LogOutBtn;
