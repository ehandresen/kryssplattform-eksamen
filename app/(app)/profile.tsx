import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  Modal,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import {
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default function ProfileScreen() {
  const { user, reloadUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState(""); // Password for re-authentication
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false); // Modal visibility

  const handleSaveChanges = async () => {
    try {
      if (user) {
        // Check if the email has been changed
        if (email !== user.email) {
          // Show modal to prompt for password
          setPasswordModalVisible(true);
        } else {
          // Update display name if only that has changed
          if (displayName !== user.displayName) {
            await updateProfile(user, { displayName });
          }
          Alert.alert("Success", "Profile updated successfully!");
          await reloadUser();
          setIsEditing(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile information");
      console.error("Profile update error:", error);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      if (user && user.email && password) {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        // Proceed with email update after re-authentication
        await updateEmail(user, email);
        Alert.alert("Success", "Your email has been updated successfully!");

        // Reload user data to reflect changes in context
        await reloadUser();
        setIsEditing(false);
      } else {
        Alert.alert("Error", "Password is required to update the email.");
      }
    } catch (error) {
      Alert.alert("Error", "Re-authentication failed. Please try again.");
      console.error("Re-authentication error:", error);
    } finally {
      setPassword(""); // Clear password after submitting
      setPasswordModalVisible(false); // Hide modal
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: "https://via.placeholder.com/150" }}
        style={styles.profileImage}
      />

      {/* Editable User Info */}
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Save Changes" onPress={handleSaveChanges} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </>
      ) : (
        <>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Password Modal */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button title="Submit" onPress={handlePasswordSubmit} />
            <Button
              title="Cancel"
              onPress={() => setPasswordModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#0096C7",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
