import { getStorageRef } from "@/firebaseConfig";
import { uploadBytes, uploadBytesResumable } from "firebase/storage";

// This function converts a local image URI into a Blob and uploads it to Firebase Storage under a specific path based on its file name.
export const uploadImageToFirebase = async (uri: string) => {
  const fetchResponse = await fetch(uri);

  // Converts the fetched file data into a binary large object (Blob) that can be uploaded to Firebase.
  const blob = await fetchResponse.blob();

  // 	Extracts the file name from the URI (e.g., "path/to/image.jpg" becomes "image")
  const imagePath = uri.split("/").pop()?.split(".")[0] ?? "";

  // Defines where the image will be stored in Firebase Storage under the 'images' folder.
  const uploadPath = `images/${imagePath}`;

  const imageRef = getStorageRef(uploadPath);

  try {
    // uploadBytesResumable() teacher mentions this can be more stable with larger image files
    await uploadBytes(imageRef, blob);
    console.log("uploading image to", uploadPath);
    return uploadPath;
  } catch (error) {
    console.log("error uploading image", error);
    return "error";
  }
};
