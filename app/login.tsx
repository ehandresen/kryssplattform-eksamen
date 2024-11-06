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
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router"; // Use `router` to handle navigation
import { signUp } from "@/api/authApi";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const { signIn, isLoading, setIsLoading, session } = useAuth();

  useEffect(() => {
    // Redirect to gallery if already logged in
    if (session) {
      router.navigate("/(app)/(tabs)/gallery"); // Absolute path
    }
  }, [session]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      if (user) {
        router.navigate("/(app)/(tabs)/gallery"); // Absolute path
      }
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert("All fields are required to sign up");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, username);
    } catch (error) {
      Alert.alert("Sign Up Error", "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUpMode ? "Sign Up" : "Login"}</Text>

      {isSignUpMode && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
        secureTextEntry={true} // hide text input
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button
            title={isSignUpMode ? "Create User" : "Login"}
            onPress={isSignUpMode ? handleSignUp : handleLogin}
            disabled={isLoading}
          />
          <Button
            title={isSignUpMode ? "Switch to Login" : "Switch to Sign Up"}
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default LoginScreen;
