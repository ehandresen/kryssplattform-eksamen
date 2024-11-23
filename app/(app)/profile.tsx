/**
 * ProfileScreen viser brukerens profil, inkludert mulighet for å redigere navn,
 * e-post, bio og profilbilde. Brukeren kan laste opp bilder fra galleriet eller
 * bruke kamera for å oppdatere profilbildet.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
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

  /**
   * Henter innlogget brukers data fra Firestore og oppdaterer state.
   */
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
          console.error("Feil ved henting av artistdata:", error);
        }
      }
    };

    fetchArtistData();
  }, [user]);

  /**
   * Oppdaterer brukerdata i Firestore når brukeren lagrer endringer.
   */
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
        console.log("Artistdata oppdatert i Firestore.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Feil ved oppdatering av artistdata:", error);
    }
  };

  /**
   * Håndterer bilde tatt med kamera og lagrer det i Firestore.
   */
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
      console.error("Feil ved lagring av bilde:", error);
    }
  };

  /**
   * Lar brukeren velge et bilde fra galleriet og oppdaterer profilbildet.
   */
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
      console.error("Feil ved bildeopplasting:", error);
    }
  };

  return (
    <View className="flex-1 items-center bg-white p-5">
      {/* Viser profilbilde med alternativer for kamera og galleri */}
      <View className="relative">
        <Image
          source={{ uri: profileImageUrl || "https://via.placeholder.com/150" }}
          className="w-36 h-36 rounded-full"
        />
        {isEditing && (
          <>
            <TouchableOpacity
              className="absolute bottom-1 right-2 bg-black p-2 rounded-md"
              onPress={() => setShowCamera(true)}
            >
              <Text className="text-white text-xs">Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="absolute bottom-1 left-2 bg-black p-2 rounded-md"
              onPress={pickImageFromGallery}
            >
              <Text className="text-white text-xs">Last opp</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Viser eller redigerer brukerens profil */}
      {isEditing ? (
        <View>
          <TextInput
            className="w-4/5 p-3 border border-gray-300 rounded-md mb-3"
            placeholder="Navn"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            className="w-4/5 p-3 border border-gray-300 rounded-md mb-3"
            placeholder="E-post"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            className="w-4/5 p-3 border border-gray-300 rounded-md mb-3"
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <Button title="Lagre endringer" onPress={updateArtistInFirestore} />
          <Button title="Avbryt" onPress={() => setIsEditing(false)} />
        </View>
      ) : (
        <View>
          <Text className="text-2xl font-bold">{displayName}</Text>
          <Text className="text-lg text-gray-600">{email}</Text>
          <Text className="text-sm text-gray-500">{bio}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text className="text-blue-500">Rediger profil</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Viser kamera-modus */}
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
