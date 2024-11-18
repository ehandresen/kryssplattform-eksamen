import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
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

  const { signIn, isLoading, setIsLoading, session } = useAuth(); // Henter metoder og tilstand fra `useAuth`

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUpMode ? "Opprett bruker" : "Logg inn"}
      </Text>

      {/* Input-felt for brukernavn (kun ved opprettelse av bruker) */}
      {isSignUpMode && (
        <TextInput
          style={styles.input}
          placeholder="Brukernavn"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      )}

      {/* Input-felt for e-post */}
      <TextInput
        style={styles.input}
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      {/* Input-felt for passord */}
      <TextInput
        style={styles.input}
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
          <Button
            title={isSignUpMode ? "Opprett bruker" : "Logg inn"}
            onPress={isSignUpMode ? handleSignUp : handleLogin}
          />

          {/* Knapp for å bytte mellom innlogging og opprettelse av bruker */}
          <Button
            title={
              isSignUpMode ? "Bytt til innlogging" : "Bytt til opprettelse"
            }
            onPress={() => setIsSignUpMode(!isSignUpMode)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff", // Bakgrunnsfarge
  },
  title: {
    fontSize: 24, // Størrelse på tittel
    fontWeight: "bold", // Fet tekst
    marginBottom: 16, // Avstand under tittelen
    textAlign: "center", // Sentrert tekst
    color: "#1D6F6B", // Tekstfarge
  },
  input: {
    height: 40, // Høyde på tekstfeltet
    borderColor: "#ccc", // Grenselinjefarge
    borderWidth: 1, // Grenselinjens tykkelse
    marginBottom: 12, // Avstand mellom felt
    paddingHorizontal: 8, // Innvendig marg for tekst
    borderRadius: 4, // Runde kanter
  },
});

export default LoginScreen;
