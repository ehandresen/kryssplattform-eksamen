import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/hooks/useAuth"; // Hook for autentisering
import { router } from "expo-router"; // Brukes til navigasjon
import { signUp } from "@/api/authApi"; // Importerer sign-up funksjonen fra API

/**
 * LoginScreen håndterer både innlogging og opprettelse av nye brukere.
 */
const LoginScreen = () => {
  // Tilstand for innlogging og opprettelse av bruker
  const [email, setEmail] = useState(""); // Holder e-postinput
  const [password, setPassword] = useState(""); // Holder passordinput
  const [username, setUsername] = useState(""); // Holder brukernavn ved opprettelse
  const [isSignUpMode, setIsSignUpMode] = useState(false); // Veksler mellom innlogging og opprettelse av bruker

  const { signIn, isLoading, setIsLoading, session, loginAsGuest } = useAuth(); // Henter metoder og tilstand fra `useAuth`

  // Brukeren omdirigeres til galleriet hvis de allerede er logget inn
  useEffect(() => {
    if (session) {
      router.navigate("/(app)/(tabs)/gallery"); // Navigerer til galleriet
    }
  }, [session]);

  /**
   * Håndterer innlogging av brukeren.
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Valideringsfeil", "E-post og passord er påkrevd.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await signIn(email, password); // Forsøker å logge inn brukeren
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

  /**
   * Håndterer opprettelse av ny bruker.
   */
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
      await signUp(email, password, username); // Oppretter ny bruker
      Alert.alert("Suksess", "Bruker opprettet!");
    } catch (error) {
      console.error("Feil under opprettelse av bruker:", error);
      Alert.alert("Feil ved opprettelse", "En feil oppsto under opprettelsen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    router.navigate("/(app)/(tabs)/gallery");
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center text-teal-600">
        {isSignUpMode ? "Opprett bruker" : "Logg inn"}
      </Text>

      {/* Input-felt for brukernavn (kun ved opprettelse av bruker) */}
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
        secureTextEntry={true} // Skjuler passordet
        placeholderTextColor="#888"
      />

      {/* Viser en spinner mens forespørsler lastes */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Knapp for enten å logge inn eller opprette bruker */}
          <TouchableOpacity
            style={styles.button}
            onPress={isSignUpMode ? handleSignUp : handleLogin}
          >
            <Text style={styles.buttonText}>
              {isSignUpMode ? "Opprett bruker" : "Logg inn"}
            </Text>
          </TouchableOpacity>

          {/* Knapp for å bytte mellom innlogging og opprettelse av bruker */}
          <TouchableOpacity
            style={[styles.button, styles.switchButton]}
            onPress={() => setIsSignUpMode(!isSignUpMode)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUpMode ? "Bytt til innlogging" : "Bytt til opprettelse"}
            </Text>
          </TouchableOpacity>

          {/* Knapp for gjeste logg inn */}
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
