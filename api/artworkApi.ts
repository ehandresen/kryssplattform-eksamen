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
 * Henter unike kategorier fra kunstverkene
 * @returns Liste over unike kategorier
 */
export const getUniqueCategories = async (): Promise<string[]> => {
  try {
    const artworks = await getAllArtworks();
    const categoriesSet = new Set<string>();

    // Legg til hver kategori i et Set for å sikre unike verdier
    artworks.forEach((artwork) => {
      if (artwork.category) {
        categoriesSet.add(artwork.category); // Legg til kategorien hvis den finnes
      }
    });

    // Returner en liste med unike kategorier
    return Array.from(categoriesSet);
  } catch (error) {
    console.error("Feil ved henting av kategorier:", error);
    return [];
  }
};

/**
 * Henter et kunstverk fra Firestore ved hjelp av ID
 * @param id - Kunstverkets ID
 * @returns Kunstverket med spesifisert ID
 */
export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  try {
    const docRef = doc(db, ARTWORKS_COLLECTION, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return {
        ...docSnapshot.data(),
        id: docSnapshot.id,
      } as Artwork;
    } else {
      console.log("Ingen kunstverk funnet med den ID-en.");
      return null;
    }
  } catch (error) {
    console.error("Feil ved henting av kunstverk etter ID:", error);
    return null;
  }
};

/**
 * Sletter et kunstverk fra Firestore ved hjelp av ID
 * @param id - Kunstverkets ID
 */
export const deleteArtworkById = async (id: string) => {
  try {
    const docRef = doc(db, ARTWORKS_COLLECTION, id);
    await deleteDoc(docRef);
    console.log(`Kunstverk med ID ${id} er slettet.`);
  } catch (error) {
    console.error("Feil ved sletting av kunstverk:", error);
  }
};

/**
 * Oppdaterer et kunstverk i Firestore
 * @param id - Kunstverkets ID
 * @param updatedArtwork - Det oppdaterte kunstverket
 */
export const updateArtworkById = async (
  id: string,
  updatedArtwork: Artwork
) => {
  try {
    const docRef = doc(db, ARTWORKS_COLLECTION, id);
    await updateDoc(docRef, updatedArtwork);
    console.log(`Kunstverk med ID ${id} er oppdatert.`);
  } catch (error) {
    console.error("Feil ved oppdatering av kunstverk:", error);
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
