/**
 * Håndterer opplasting av bilder til Firebase Storage.
 * Funksjonen laster opp et bilde og returnerer en nedlastnings-URL.
 */

import { getStorageRef } from "@/firebaseConfig";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * Laster opp et bilde til Firebase Storage
 * og returnerer nedlastnings-URL-en
 * @param uri
 * @returns
 */
export const uploadImageToFirebase = async (uri: string): Promise<string> => {
  try {
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    const filename = `images/${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const imageRef = getStorageRef(filename);

    const uploadTask = uploadBytesResumable(imageRef, blob);

    await uploadTask;
    const downloadUrl = await getDownloadURL(imageRef);

    console.log("Bilde lastet opp og tilgjengelig på:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Feil ved opplasting av bilde til Firebase:",
        error.message
      );
    } else {
      console.error("Ukjent feil ved opplasting av bilde til Firebase:", error);
    }
    throw error;
  }
};
