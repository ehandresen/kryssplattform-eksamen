// UploadForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Artwork } from "@/types/artwork";
import { addArtworkToFirestore } from "@/api/artworkApi";
import ProceedBtn from "../../../ProceedBtn";
import CameraScreen from "@/components/CameraScreen";
import { formatToEuropeanDate } from "@/utils/helpers";

type UploadFormProps = {
  visible: boolean;
  onClose: () => void;
};

const UploadForm = ({ visible, onClose }: UploadFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [showCamera, setShowCamera] = useState(false); // Toggle for camera view

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCameraCapture = (capturedImageUri: string) => {
    setImage(capturedImageUri);
    setShowCamera(false); // Hide camera after capturing
  };

  const handleSubmit = async () => {
    const artwork: Artwork = {
      id: Math.random().toFixed(7).toString(),
      title,
      artistId: "artist1", // Replace with dynamic artist ID if needed
      imageUrl: image || "",
      caption,
      description,
      createdDate: formatToEuropeanDate(new Date()),
      category,
      views: 0,
      likes: [],
      comments: [],
    };

    await addArtworkToFirestore(artwork);
    onClose(); // Close form after submission
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        {showCamera ? (
          <CameraScreen
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.formContainer}>
            <Text style={styles.title}>Upload Artwork</Text>

            {/* Title Input */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="Title of the artwork"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            {/* Caption Input */}
            <Text style={styles.label}>Caption</Text>
            <TextInput
              placeholder="Enter caption"
              value={caption}
              onChangeText={setCaption}
              style={styles.input}
            />

            {/* Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
            />

            {/* Category Input */}
            <Text style={styles.label}>Category</Text>
            <TextInput
              placeholder="Enter category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />

            {/* Image Preview */}
            <View style={styles.imageContainer}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>

            {/* Image Upload and Camera Options */}
            <Button title="Upload Image from Gallery" onPress={pickImage} />
            <Button title="Open Camera" onPress={() => setShowCamera(true)} />

            {/* Submit and Cancel Buttons */}
            <ProceedBtn title="Submit" onPress={handleSubmit} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#d19898",
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageContainer: {
    alignItems: "center",
    padding: 16,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UploadForm;
