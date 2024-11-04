import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Artwork } from '@/types/artwork';
import { addArtworkToFirestore } from '@/api/artworkApi';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('image uri:', result.assets[0].uri);
      console.log('image:', image);
    }
  };

  const handleImageUpload = () => {
    pickImage();
  };

  const handleSubmit = async () => {
    const artwork: Artwork = {
      id: Math.random().toFixed(7).toString(),
      description,
      imageUrl: image ? image : '',
    };

    await addArtworkToFirestore(artwork);
  };

  return (
    <View style={styles.container}>
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

      <Button title="Upload Image" onPress={handleImageUpload} />
      <Button
        title="Submit"
        onPress={handleSubmit}
        // style={styles.submitButton}
      />
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
  submitButton: {
    marginTop: 10,
  },
});
