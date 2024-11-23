/**
 * Håndterer innlogging, opprettelse av
 * nye brukere og gjestetilgang.
 */

import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { signUp } from "@/api/authApi";

const LoginScreen = () => {
  // State for brukerinndata og modus
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const { signIn, isLoading, setIsLoading, session, loginAsGuest } = useAuth();

  // Navigerer brukeren til galleriet hvis allerede logget inn
  useEffect(() => {
    if (session) {
      router.navigate("/(app)/(tabs)/gallery");
    }
  }, [session]);

  //Håndterer innlogging av brukere.

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Valideringsfeil", "E-post og passord er påkrevd.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      if (user) {
        router.navigate("/(app)/(tabs)/gallery");
      }
    } catch (error) {
      console.error("Feil under innlogging:", error);
      Alert.alert("Feil", "Ugyldig e-post eller passord.");
    } finally {
      setIsLoading(false);
    }
  };

  // Håndterer opprettelse av nye brukere.

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert(
        "Valideringsfeil",
        "Alle feltene må fylles ut for å opprette en bruker."
      );
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, username);
      Alert.alert("Suksess", "Bruker opprettet!");
    } catch (error) {
      console.error("Feil under opprettelse av bruker:", error);
      Alert.alert("Feil ved opprettelse", "En feil oppsto under opprettelsen.");
    } finally {
      setIsLoading(false);
    }
  };

  // Håndterer innlogging som gjest.

  const handleGuestLogin = () => {
    loginAsGuest();
    router.navigate("/(app)/(tabs)/gallery");
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center text-teal-600">
        {isSignUpMode ? "Opprett bruker" : "Logg inn"}
      </Text>

      {/* Input-felt for brukernavn (kun ved opprettelse) */}
      {isSignUpMode && (
        <TextInput
          className="h-10 border border-gray-300 rounded-md p-2 mb-4"
          placeholder="Brukernavn"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      )}

      {/* Input-felt for e-post */}
      <TextInput
        className="h-10 border border-gray-300 rounded-md p-2 mb-4"
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      {/* Input-felt for passord */}
      <TextInput
        className="h-10 border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Passord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholderTextColor="#888"
      />

      {/* Viser en spinner under lasting */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Knapp for innlogging/opprettelse */}
          <TouchableOpacity
            style={styles.button}
            onPress={isSignUpMode ? handleSignUp : handleLogin}
          >
            <Text style={styles.buttonText}>
              {isSignUpMode ? "Opprett bruker" : "Logg inn"}
            </Text>
          </TouchableOpacity>

          {/* Veksle mellom innlogging og opprettelse */}
          <TouchableOpacity
            style={[styles.button, styles.switchButton]}
            onPress={() => setIsSignUpMode(!isSignUpMode)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUpMode ? "Bytt til innlogging" : "Bytt til opprettelse"}
            </Text>
          </TouchableOpacity>

          {/* Knapp for gjestetilgang */}
          <TouchableOpacity
            style={[styles.button, styles.guestButton]}
            onPress={handleGuestLogin}
          >
            <Text style={styles.guestButtonText}>Fortsett som Gjest</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#008080",
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  switchButton: {
    backgroundColor: "#004d4d",
  },
  switchButtonText: {
    color: "#fff",
  },
  guestButton: {
    backgroundColor: "#d3d3d3",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  guestButtonText: {
    color: "#888",
  },
});

export default LoginScreen;
