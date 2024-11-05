// CameraScreen.js
import { CameraView } from 'expo-camera';
import { useRef } from 'react';
import { Button, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

type CameraScreenProps = {
  onCapture: (uri: string) => void;
  onClose: () => void;
};

export default function CameraScreen({
  onCapture,
  onClose,
}: CameraScreenProps) {
  const cameraRef = useRef<any>(null);

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={capturePhoto}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
          <Button title="Close Camera" onPress={onClose} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});
