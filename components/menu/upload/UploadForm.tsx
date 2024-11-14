import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Artwork } from "@/types/artwork";
import { addArtworkToFirestore } from "@/api/artworkApi";
import CameraScreen from "@/components/CameraScreen";
import { formatToEuropeanDate } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";

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
  const [showCamera, setShowCamera] = useState(false);

  const { user } = useAuth();

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
    };

    await addArtworkToFirestore(artwork);
    onClose();
  };

  return (
    <Modal
      presentationStyle="formSheet"
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 p-4 justify-center items-center">
        {showCamera ? (
          <CameraScreen
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg"
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Upload Artwork
            </Text>

            {/* Image Preview */}
            <View className="flex items-center mb-5">
              {image ? (
                <Image
                  source={{ uri: image }}
                  // problems showing image using nativewind
                  style={{ height: 200, width: 200, borderRadius: 8 }}
                />
              ) : (
                <View className="h-56 w-56 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Text className="text-gray-500">No Image Selected</Text>
                </View>
              )}
              <Button title="Upload Image from Gallery" onPress={pickImage} />
              <Button title="Open Camera" onPress={() => setShowCamera(true)} />
            </View>

            {/* Form Fields */}
            <View className="w-full space-y-4">
              <View>
                <Text className="text-lg font-semibold text-gray-700">
                  Title
                </Text>
                <TextInput
                  placeholder="Title of the artwork"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="gray"
                  style={styles.input}
                />
              </View>

              <View>
                <Text className="text-lg font-semibold text-gray-700">
                  Caption
                </Text>
                <TextInput
                  placeholder="Enter caption"
                  value={caption}
                  onChangeText={setCaption}
                  style={styles.input}
                  placeholderTextColor="gray"
                />
              </View>

              <View>
                <Text className="text-lg font-semibold text-gray-700">
                  Description
                </Text>
                <TextInput
                  placeholder="Enter description"
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="gray"
                  multiline
                  style={styles.input}
                  numberOfLines={4}
                />
              </View>

              <View>
                <Text className="text-lg font-semibold text-gray-700">
                  Category
                </Text>
                <TextInput
                  placeholder="Enter category"
                  value={category}
                  onChangeText={setCategory}
                  style={styles.input}
                  placeholderTextColor="gray"
                />
              </View>
            </View>

            {/* Submit and Cancel Buttons */}
            <View className="w-full mt-6 space-y-4">
              {/* <ProceedBtn
                title="Submit"
                onPress={handleSubmit}
                //className="w-full bg-blue-600 rounded-lg p-4 shadow-lg"
              /> */}
              <TouchableOpacity
                onPress={handleSubmit}
                className="w-full p-4 bg-blue-500 rounded shadow-lg mt-2"
              >
                <Text className="text-center text-white font-bold">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="w-full p-4 rounded shadow-lg mt-2"
                style={{ backgroundColor: "gray" }}
              >
                <Text className="text-center text-white font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    shadowColor: "#000", // Tailwind shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 12,
  },
});

export default UploadForm;
