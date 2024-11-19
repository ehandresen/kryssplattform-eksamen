import { getStorageRef } from "@/firebaseConfig";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * Laster opp et bilde til Firebase Storage og returnerer nedlastnings-URL-en
 * @param uri - Filstien eller URI-en til bildet som skal lastes opp
 * @returns En streng med nedlastnings-URL-en
 */
export const uploadImageToFirebase = async (uri: string): Promise<string> => {
  try {
    // Hent bildefilen som en blob
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    // Generer et unikt filnavn for bildet
    const filename = `images/${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const imageRef = getStorageRef(filename);

    // Last opp filen til Firebase Storage
    const uploadTask = uploadBytesResumable(imageRef, blob);

    // Vent til opplastingen er fullført, og hent nedlastnings-URL-en
    await uploadTask;
    const downloadUrl = await getDownloadURL(imageRef);

    console.log("Bilde lastet opp og tilgjengelig på:", downloadUrl);
    return downloadUrl; // Returnerer nedlastnings-URL-en
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Feil ved opplasting av bilde til Firebase:",
        error.message
      );
    } else {
      console.error("Ukjent feil ved opplasting av bilde til Firebase:", error);
    }
    throw error; // Kaster feilen videre for å håndtere den der funksjonen brukes
  }
};
