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
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { db } from "@/firebaseConfig";
import CameraScreen from "@/components/CameraScreen";
import { uploadImageToFirebase } from "@/api/imageApi";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useArtwork } from "@/hooks/useArtwork";
import { Artwork } from "@/types/artwork";

export default function ProfileScreen() {
  const { user, reloadUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);

  const { artworks, isLoading } = useArtwork();

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

            // Filtrer kunstverk som matcher brukerens ID
            const filteredArtworks = artworks.filter(
              (artwork) => artwork.artistId === user.uid
            );
            setUserArtworks(filteredArtworks);
          }
        } catch (error) {
          console.error("Error fetching artistdata:", error);
        }
      }
    };

    fetchArtistData();
  }, [user, artworks]);

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
        console.log("Artist data updated in Firestore.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error fetching artistdata:", error);
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
      console.error("Error saving image", error);
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
      console.error("Error uploading image", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Profile Image Section */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: profileImageUrl || "https://via.placeholder.com/150" }}
          className="w-36 h-36 rounded-full border-4 border-blue-500 shadow-lg"
        />
        {isEditing && (
          <View className="flex-row space-x-4 mt-4">
            {/* Kamera Knapp */}
            <TouchableOpacity
              className="bg-blue-500 p-3 mr-2 rounded-full"
              onPress={() => setShowCamera(true)}
            >
              <FontAwesome5 name="camera" size={16} color="white" />
            </TouchableOpacity>
            {/* Galleri knapp */}
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-full"
              onPress={pickImageFromGallery}
            >
              <MaterialIcons name="photo-library" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Viser eller redigerer brukerens profil */}
      {isEditing ? (
        <View className="space-y-4">
          <TextInput
            className="w-full bg-white p-4 rounded-lg border border-gray-300"
            placeholder="Name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            className="w-full bg-white p-4 rounded-lg border border-gray-300"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            className="w-full bg-white p-4 rounded-lg border border-gray-300"
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg my-2"
            onPress={updateArtistInFirestore}
          >
            <Text className="text-white text-center font-bold">
              Save Changes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 p-4 rounded-lg"
            onPress={() => setIsEditing(false)}
          >
            <Text className="text-white text-center font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center space-y-3">
          <Text className="text-xl font-bold text-gray-900">{displayName}</Text>
          <Text className="text-lg text-gray-600">{email}</Text>
          <Text className="text-sm text-gray-500 text-center">{bio}</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="bg-blue-500 px-6 py-2 rounded-lg mt-4"
          >
            <Text className="text-white font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Viser brukerens kunstverk */}
      <View>
        <Text className="text-lg font-bold text-gray-900 my-4">
          Your Artworks
        </Text>
        {userArtworks.length === 0 ? (
          <Text className="text-gray-500">No artworks uploaded yet.</Text>
        ) : (
          <View className="space-y-4">
            {userArtworks.map((artwork) => (
              <TouchableOpacity
                key={artwork.id}
                className="bg-white rounded-lg shadow-md p-4 mb-2"
              >
                <Image
                  source={{ uri: artwork.imageUrl }}
                  className="w-full h-40 rounded-md"
                />
                <Text className="mt-2 font-bold text-gray-800">
                  {artwork.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  {artwork.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Viser kamera-modus */}
      {showCamera && (
        <Modal visible={showCamera} animationType="slide">
          <CameraScreen
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        </Modal>
      )}
    </ScrollView>
  );
}
