import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CameraScreen from "@/components/CameraScreen"; // Assuming you have this component for capturing photos
import { Artwork } from "@/types/artwork";
import { addArtworkToFirestore } from "@/api/artworkApi"; // Assuming this function handles Firestore interaction
import { useAuth } from "@/hooks/useAuth"; // Assuming this gives user authentication data
import { formatToEuropeanDate } from "@/utils/helpers"; // Assuming this formats date
import { useExhibitions } from "@/hooks/useExhibitions"; // Use the custom hook for fetching exhibitions
import { Picker } from "@react-native-picker/picker"; // Correct import for Picker

type UploadProps = {
  visible: boolean;
  onClose: () => void;
};

const Upload = ({ visible, onClose }: UploadProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [exhibitionId, setExhibitionId] = useState<string | null>(null); // State for exhibition ID selection

  const { user } = useAuth();
  const { exhibitions, isLoading } = useExhibitions(); // Use the hook to get exhibitions

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCameraCapture = (capturedImageUri: string) => {
    setImage(capturedImageUri);
    setShowCamera(false);
  };

  const handleSubmit = async () => {
    const artwork: Artwork = {
      id: Math.random().toFixed(7).toString(),
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
      exhibitionId: exhibitionId || undefined, // Conditionally set exhibitionId (optional)
    };

    await addArtworkToFirestore(artwork);
    onClose();
  };

  // Display loading indicator while exhibitions are being fetched
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading Exhibitions...</Text>
      </View>
    );
  }

  return (
    <Modal
      presentationStyle="formSheet"
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {showCamera ? (
          <CameraScreen
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <View>
            <Text style={styles.title}>Upload Artwork</Text>

            {/* Image Preview */}
            <View style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>No Image Selected</Text>
                </View>
              )}
              <Button title="Upload Image from Gallery" onPress={pickImage} />
              <Button title="Open Camera" onPress={() => setShowCamera(true)} />
            </View>

            {/* Form Fields */}
            <TextInput
              placeholder="Title of the artwork"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter caption"
              value={caption}
              onChangeText={setCaption}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
            />
            <TextInput
              placeholder="Enter category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />

            {/* Exhibition Selection (Dropdown) */}
            <View style={styles.dropdownContainer}>
              <Text>Select an Exhibition (Optional)</Text>
              <Picker
                selectedValue={exhibitionId}
                onValueChange={(itemValue: string) =>
                  setExhibitionId(itemValue)
                } // Explicitly typing itemValue
              >
                <Picker.Item label="Select an exhibition" value={null} />
                {exhibitions.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.title}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Submit and Cancel Buttons */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: "100%",
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
});

export default Upload;
