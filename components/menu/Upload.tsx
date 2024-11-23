/**
 * Komponent for opplasting av kunstverk.
 * Tillater brukeren å legge til informasjon om kunstverket, laste opp bilder fra galleri eller kamera, og knytte kunstverket til en utstilling (valgfritt).
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CameraScreen from "@/components/CameraScreen";
import { Artwork } from "@/types/artwork";
import { addArtworkToFirestore } from "@/api/artworkApi";
import { useAuth } from "@/hooks/useAuth";
import { formatToEuropeanDate } from "@/utils/helpers";
import { useExhibition } from "@/hooks/useExhibition";
import { Picker } from "@react-native-picker/picker";
import { useArtwork } from "@/hooks/useArtwork";
import Toast from "react-native-toast-message";

type UploadProps = {
  visible: boolean;
  onClose: () => void;
};

const Upload = ({ visible, onClose }: UploadProps) => {
  // State for skjemafelter
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [exhibitionId, setExhibitionId] = useState<string | undefined>(
    undefined
  );
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);

  const { user, role } = useAuth(); // Henter brukerinformasjon
  const { exhibitions, isLoading } = useExhibition(); // Henter utstillinger
  const { addArtwork } = useArtwork();

  /**
   * Håndterer opplasting av bilde fra galleri.
   */
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Feil ved opplasting av bilde:", error);
    }
  };

  /**
   * Håndterer bilde tatt med kamera.
   * @param capturedImageUri URI for det tatt bilde
   */
  const handleCameraCapture = (capturedImageUri: string) => {
    setImage(capturedImageUri);
    setShowCamera(false);
  };

  /**
   * Sender det nye kunstverket til Firestore.
   */
  const handleSubmit = async () => {
    const artwork: Artwork = {
      id: Math.random().toFixed(7).toString(), // Midlertidig ID
      title,
      artistId: user?.uid,
      imageUrl: image || "",
      caption,
      description,
      createdDate: formatToEuropeanDate(new Date()),
      category,
      views: 0,
      likes: [],
      comments: [],
      exhibitionId: exhibitionId || undefined,
    };

    try {
      setIsUploadingArtwork(true);
      await addArtwork(artwork);
      console.log("Kunstverk lagt til:", artwork);

      Toast.show({
        type: "success",
        text1: "Kunstverk lastet opp",
        text2: "Ditt kunstverk er nå tilgjengelig!",
      });

      onClose(); // Lukker modal etter opplasting
    } catch (error) {
      console.error("Feil ved opplasting av kunstverk:", error);

      Toast.show({
        type: "error",
        text1: "Feil ved opplasting",
        text2: "Kunne ikke laste opp kunstverket. Prøv igjen.",
      });
    } finally {
      setIsUploadingArtwork(false);
    }
  };

  // Hvis bruker ikke er logget inn, hvis denne meldingen
  if (role === "guest") {
    return (
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-600 text-center mb-2">
            Du må være logget inn for å laste opp kunstverk.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-full py-2 bg-gray-100 rounded-lg items-center"
          >
            <Text className="text-gray-600 font-medium">Gå tilbake</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      presentationStyle="formSheet"
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {showCamera ? (
          <CameraScreen
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <>
            <View>
              <Text style={styles.title}>Last opp kunstverk</Text>

              {/* Forhåndsvisning av bilde */}
              <View style={styles.imageContainer}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text>Ingen bilde valgt</Text>
                  </View>
                )}
                <Button title="Velg bilde fra galleri" onPress={pickImage} />
                <Button
                  title="Åpne kamera"
                  onPress={() => setShowCamera(true)}
                />
              </View>

              {/* Skjemafelter */}
              <TextInput
                placeholder="Tittel på kunstverket"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Bildetekst"
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                style={styles.input}
              />
              <TextInput
                placeholder="Beskrivelse"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
              />
              <TextInput
                placeholder="Kategori"
                placeholderTextColor="#999"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
              />

              {/* Valgfritt valg av utstilling */}
              <View style={styles.dropdownContainer}>
                {/* <Text>Velg en utstilling (valgfritt)</Text> */}
                <Picker
                  selectedValue={exhibitionId}
                  onValueChange={(itemValue) =>
                    setExhibitionId(itemValue || undefined)
                  }
                  style={{ width: "100%" }}
                >
                  <Picker.Item
                    label="Velg en utstilling (valgfritt)"
                    value={undefined}
                  />
                  {exhibitions.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.title}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>

              {/* Lagre og avbryt-knapper */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.buttonText}>Lagre</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Avbryt</Text>
              </TouchableOpacity>
            </View>

            {/* Viser lasteskjerm */}
            {(isLoading || isUploadingArtwork) && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Laster opp...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // marginBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imagePlaceholder: {
    height: 200,
    width: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownContainer: {
    // width: "100%",
    marginBottom: 12,
  },
  submitButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  cancelButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f44336",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default Upload;
