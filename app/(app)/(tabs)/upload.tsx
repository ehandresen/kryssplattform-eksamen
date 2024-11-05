import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Artwork } from '@/types/artwork';
import { addArtworkToFirestore } from '@/api/artworkApi';
import CameraScreen from '@/components/CameraScreen';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false); // Toggle for camera view

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImageUpload = () => {
    pickImage();
  };

  const handleCameraCapture = (capturedImageUri: string) => {
    setImage(capturedImageUri);
    setShowCamera(false); // Hide camera after capturing
  };

  const handleSubmit = async () => {
    const artwork: Artwork = {
      id: Math.random().toFixed(7).toString(),
      title,
      description,
      imageUrl: image ? image : '',
    };

    await addArtworkToFirestore(artwork);
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <CameraScreen
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      ) : (
        <>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.imageContainer}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>

          <Button
            title="Upload Image from Gallery"
            onPress={handleImageUpload}
          />
          <Button title="Open Camera" onPress={() => setShowCamera(true)} />
          <Button title="Submit" onPress={handleSubmit} />
        </>
      )}
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 8,
  },
});
