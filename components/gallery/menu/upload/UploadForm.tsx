// UploadForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import ProceedBtn from "../../../ProceedBtn";

type UploadFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const UploadForm = ({ visible, onClose, onSubmit }: UploadFormProps) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // Placeholder for image upload
  const [hashtags, setHashtags] = useState("");
  const [description, setDescription] = useState("");

  // Dummy artist name from profile, replace this with actual data from the user's profile context if available
  const artistName = "John Doe";

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Upload Artwork</Text>

          {/* Artist Name */}
          <Text style={styles.artistText}>Artist: {artistName}</Text>

          {/* Title Input */}
          <TextInput
            placeholder="Title of the artwork"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Image Upload (Placeholder) */}
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={() => alert("Image upload not implemented")}
          >
            <Text>{image ? "Image Selected" : "Select Image"}</Text>
          </TouchableOpacity>

          {/* Hashtags Input */}
          <TextInput
            placeholder="Hashtags"
            value={hashtags}
            onChangeText={setHashtags}
            style={styles.input}
          />

          {/* Description Input */}
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          {/* Upload Button */}
          <ProceedBtn title="Upload" onPress={onSubmit} />

          {/* Close/Cancel Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#d19898", // Matching color from your example
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  artistText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  imageUpload: {
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
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
