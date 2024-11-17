import { getStorageRef } from "@/firebaseConfig";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadImageToFirebase = async (uri: string): Promise<string> => {
  try {
    // Fetch the image file as a blob
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    // Generate a unique filename for the image
    const filename = `images/${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const imageRef = getStorageRef(filename);

    // Upload the file using Firebase Storage
    const uploadTask = uploadBytesResumable(imageRef, blob);

    // Wait for the upload to complete and get the download URL
    await uploadTask;
    const downloadUrl = await getDownloadURL(imageRef);

    console.log("Image uploaded and accessible at:", downloadUrl);
    return downloadUrl; // Return the proper download URL
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw error;
  }
};
