import { Artwork } from "@/types/artwork";
import { uploadImageToFirebase } from "./imageApi";
import { db, getDownloadUrl } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const ARTWORKS_COLLECTION = "artworks"; // Navn på Firestore-kolleksjonen for kunstverk

/**
 * Legger til et nytt kunstverk i Firestore
 * @param artwork - Kunstverksdata som skal lagres
 */
export const addArtworkToFirestore = async (artwork: Artwork) => {
  try {
    // Last opp bildet til Firebase Storage
    const firebaseImage = await uploadImageToFirebase(artwork.imageUrl);

    if (firebaseImage === "error") {
      console.error("Feil ved opplasting av bildet.");
      return;
    }

    // Hent den offentlige URL-en for det opplastede bildet
    const artworkImageDownloadUrl = await getDownloadUrl(firebaseImage);

    // Opprett nytt kunstverk-objekt med den oppdaterte URL-en
    const artworkWithNewImageUrl: Artwork = {
      ...artwork,
      imageUrl: artworkImageDownloadUrl,
    };

    // Lagre kunstverket i Firestore
    const docRef = await addDoc(
      collection(db, ARTWORKS_COLLECTION),
      artworkWithNewImageUrl
    );
    console.log("Kunstverk lagret med ID:", docRef.id);
  } catch (error) {
    console.error("Feil ved lagring av kunstverk:", error);
  }
};

/**
 * Henter alle kunstverk fra Firestore
 * @returns Liste over kunstverk
 */
export const getAllArtworks = async (): Promise<Artwork[]> => {
  try {
    const artworksDocs = await getDocs(collection(db, ARTWORKS_COLLECTION));

    // Map hvert dokument til et Artwork-objekt
    return artworksDocs.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Artwork;
    });
  } catch (error) {
    console.error("Feil ved henting av kunstverk fra Firestore:", error);
    return [];
  }
};

/**
 * Henter ett kunstverk basert på ID
 * @param id - Firestore-dokument-ID for kunstverket
 * @returns Kunstverksdata
 */
export const getArtworkById = async (id: string) => {
  try {
    const artworkDoc = await getDoc(doc(db, ARTWORKS_COLLECTION, id));
    if (!artworkDoc.exists()) {
      console.warn("Ingen kunstverk funnet med ID:", id);
      return null;
    }

    return {
      ...artworkDoc.data(),
      id: artworkDoc.id,
    } as Artwork;
  } catch (error) {
    console.error("Feil ved henting av kunstverk med ID:", id, error);
  }
};

/**
 * Sletter et kunstverk fra Firestore
 * @param id - Firestore-dokument-ID for kunstverket
 */
export const deleteArtwork = async (id: string) => {
  try {
    await deleteDoc(doc(db, ARTWORKS_COLLECTION, id));
    console.log("Kunstverk slettet med ID:", id);
  } catch (error) {
    console.error("Feil ved sletting av kunstverk:", error);
  }
};

/**
 * Oppdaterer likes for et kunstverk
 * @param id - Firestore-dokument-ID for kunstverket
 * @param userId - Bruker-ID som liker eller unliker kunstverket
 */
export const updateArtworkLikes = async (id: string, userId: string) => {
  try {
    const artworkRef = doc(db, ARTWORKS_COLLECTION, id); // Referanse til Firestore-dokumentet
    const artworkSnapshot = await getDoc(artworkRef);

    if (!artworkSnapshot.exists()) {
      console.warn(
        "Ingen kunstverk funnet for oppdatering av likes med ID:",
        id
      );
      return;
    }

    const artworkData = artworkSnapshot.data();
    const likes = artworkData?.likes || []; // Initialiser likes til tom array hvis den ikke eksisterer

    // Oppdater likes basert på om bruker-ID allerede finnes i listen
    const updatedLikes = likes.includes(userId)
      ? likes.filter((like: string) => like !== userId) // Fjern bruker-ID fra likes
      : [...likes, userId]; // Legg til bruker-ID i likes

    console.log("Oppdaterte likes for ID:", id, updatedLikes);

    // Lagre de oppdaterte likes i Firestore
    await updateDoc(artworkRef, { likes: updatedLikes });
  } catch (error) {
    console.error("Feil ved oppdatering av likes for kunstverk:", error);
  }
};
