import { CameraView } from "expo-camera";
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
  onCapture: (uri: string) => void;
  onClose: () => void;
};

export default function CameraScreen({
  onCapture,
  onClose,
}: CameraScreenProps) {
  const cameraRef = useRef<any>(null);

  /**
   * Håndterer prosessen med å ta et bilde.
   * Hvis kameraet ikke er klart, logger det en feilmelding.
   */
  const capturePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Image URI:", photo.uri);
        onCapture(photo.uri);
      } else {
        console.error("Camera is not ready.");
        Alert.alert("Error", "Camere is not ready. Try again.");
      }
    } catch (error) {
      console.error("Error under image upload:", error);
      Alert.alert("Error", "Something went wrong under image upload.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Kamera-visning */}
      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.buttonContainer}>
          {/* Knapper for funksjonalitet */}
          <TouchableOpacity style={styles.button} onPress={capturePhoto}>
            <Text style={styles.text}>Take picture</Text>
          </TouchableOpacity>
          <Button title="Close camera" onPress={onClose} />
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
