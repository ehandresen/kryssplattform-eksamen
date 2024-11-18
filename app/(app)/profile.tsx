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
  const { user, reloadUser } = useAuth(); // Henter innlogget brukerdata og funksjon for å oppdatere bruker
  const [displayName, setDisplayName] = useState(""); // Navn på brukeren
  const [email, setEmail] = useState(""); // E-post for brukeren
  const [bio, setBio] = useState(""); // Bio for brukeren
  const [profileImageUrl, setProfileImageUrl] = useState(""); // URL for profilbilde
  const [isEditing, setIsEditing] = useState(false); // Indikerer om brukeren redigerer profilen
  const [showCamera, setShowCamera] = useState(false); // Indikerer om kameraet vises

  useEffect(() => {
    // Henter data for innlogget bruker fra Firestore
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
          console.error("Feil ved henting av artistdata:", error); // Feilhåndtering
        }
      }
    };

    fetchArtistData();
  }, [user]);

  // Oppdaterer artistdata i Firestore
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
        console.log("Artistdata oppdatert i Firestore."); // Debugging
        setIsEditing(false); // Avslutt redigeringsmodus
      }
    } catch (error) {
      console.error("Feil ved oppdatering av artistdata:", error); // Feilhåndtering
    }
  };

  // Håndterer bilde fra kamera
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
      console.error("Feil ved lagring av bilde:", error); // Feilhåndtering
    }
  };

  // Håndterer bildevalg fra galleriet
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
      console.error("Feil ved bildeopplasting:", error); // Feilhåndtering
    }
  };

  return (
    <View style={styles.container}>
      {/* Profilbilde med redigeringsalternativer */}
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
              <Text style={{ color: "#fff", fontSize: 12 }}>Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editIcon, { left: 10 }]}
              onPress={pickImageFromGallery}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>Last opp</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Profilredigering eller visning */}
      {isEditing ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Navn"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={styles.input}
            placeholder="E-post"
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
          <Button title="Lagre endringer" onPress={updateArtistInFirestore} />
          <Button title="Avbryt" onPress={() => setIsEditing(false)} />
        </View>
      ) : (
        <View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.bio}>{bio}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text>Rediger profil</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Kamera-modus */}
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
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  bio: {
    fontSize: 14,
    color: "#999",
  },
});
