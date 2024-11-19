import { CameraView } from "expo-camera"; // Kamera-komponent fra Expo
import { useRef } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";

type CameraScreenProps = {
  onCapture: (uri: string) => void; // Funksjon som returnerer URI til det tatt bildet
  onClose: () => void; // Funksjon for å lukke kamerasiden
};

export default function CameraScreen({
  onCapture,
  onClose,
}: CameraScreenProps) {
  const cameraRef = useRef<any>(null); // Referanse til kameraet

  /**
   * Håndterer prosessen med å ta et bilde.
   * Hvis kameraet ikke er klart, logger det en feilmelding.
   */
  const capturePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync(); // Tar et bilde
        console.log("Bilde URI:", photo.uri); // Debugging: Log URI til bildet
        onCapture(photo.uri); // Sender URI til forelderen
      } else {
        console.error("Kameraet er ikke klart."); // Feilhåndtering
        Alert.alert("Feil", "Kameraet er ikke klart. Prøv igjen.");
      }
    } catch (error) {
      console.error("Feil under bildeopptak:", error); // Logger feil under opptak
      Alert.alert("Feil", "Noe gikk galt under bildeopptaket.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Kamera-visning */}
      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.buttonContainer}>
          {/* Knapper for funksjonalitet */}
          <TouchableOpacity style={styles.button} onPress={capturePhoto}>
            <Text style={styles.text}>Ta bilde</Text>
          </TouchableOpacity>
          <Button title="Lukk kamera" onPress={onClose} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
});
