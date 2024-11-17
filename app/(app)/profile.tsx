import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { db } from "@/firebaseConfig";
import CameraScreen from "@/components/CameraScreen";
import { uploadImageToFirebase } from "@/api/imageApi";

export default function ProfileScreen() {
  const { user, reloadUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (user?.uid) {
        try {
          const artistRef = doc(db, "artists", user.uid);
          const artistDoc = await getDoc(artistRef);

          if (artistDoc.exists()) {
            const data = artistDoc.data();
            setDisplayName(data.displayName || "");
            setEmail(data.email || "");
            setBio(data.bio || "");
            setProfileImageUrl(
              data.profileImageUrl || "https://via.placeholder.com/150"
            );
          }
        } catch (error) {
          console.error("Error fetching artist data:", error);
        }
      }
    };

    fetchArtistData();
  }, [user]);

  const updateArtistInFirestore = async () => {
    try {
      if (user?.uid) {
        const artistRef = doc(db, "artists", user.uid);
        await updateDoc(artistRef, {
          displayName,
          email,
          bio,
          profileImageUrl,
        });
        console.log("Artist document updated successfully.");
      }
    } catch (error) {
      console.error("Error updating artist document:", error);
    }
  };

  const handleCameraCapture = async (imageUri: string) => {
    try {
      const downloadUrl = await uploadImageToFirebase(imageUri);
      setProfileImageUrl(downloadUrl);

      if (user?.uid) {
        const artistRef = doc(db, "artists", user.uid);
        await updateDoc(artistRef, { profileImageUrl: downloadUrl });
      }

      setShowCamera(false);
    } catch (error) {
      console.error("Error capturing or uploading image:", error);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const downloadUrl = await uploadImageToFirebase(uri);
        setProfileImageUrl(downloadUrl);

        if (user?.uid) {
          const artistRef = doc(db, "artists", user.uid);
          await updateDoc(artistRef, { profileImageUrl: downloadUrl });
        }
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: profileImageUrl || "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />
        {isEditing && (
          <>
            <TouchableOpacity
              style={[styles.editIcon, { right: 10 }]}
              onPress={() => setShowCamera(true)}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editIcon, { left: 10 }]}
              onPress={pickImageFromGallery}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>Upload</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {isEditing ? (
        <View>
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
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <Button title="Save Changes" onPress={updateArtistInFirestore} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </View>
      ) : (
        <View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.bio}>{bio}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCamera && (
        <Modal visible={showCamera} animationType="slide">
          <CameraScreen
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 5,
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
});
