/**
 * CRUD-operasjoner (Create, Read, Update, Delete)
 * for å håndtere "Artwork" i Firebase.
 */

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

export const ARTWORKS_COLLECTION = "artworks";

/**
 * Legger til et nytt artwork i Firestore
 * @param artwork
 */
export const addArtworkToFirestore = async (artwork: Artwork) => {
  try {
    const firebaseImage = await uploadImageToFirebase(artwork.imageUrl);

    if (firebaseImage === "error") {
      console.error("Feil ved opplasting av bildet.");
      return;
    }

    const artworkImageDownloadUrl = await getDownloadUrl(firebaseImage);

    const artworkWithNewImageUrl: Artwork = {
      ...artwork,
      imageUrl: artworkImageDownloadUrl,
    };

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
 * Henter alle artworks fra Firestore
 * @returns
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
 * Henter unike kategorier fra artworks
 * @returns
 */
export const getUniqueCategories = async (): Promise<string[]> => {
  try {
    const artworks = await getAllArtworks();
    const categoriesSet = new Set<string>();

    artworks.forEach((artwork) => {
      if (artwork.category) {
        categoriesSet.add(artwork.category);
      }
    });

    return Array.from(categoriesSet);
  } catch (error) {
    console.error("Feil ved henting av kategorier:", error);
    return [];
  }
};

/**
 * Henter et artwork fra Firestore ved hjelp av ID
 * @param id
 * @returns
 */
export const getArtworkById = async (id: string) => {
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
    }
  } catch (error) {
    console.error("Feil ved henting av kunstverk etter ID:", error);
  }
};

/**
 * Sletter et artwork fra Firestore ved hjelp av ID
 * @param id
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
 * Oppdaterer et artwork i Firestore
 * @param id
 * @param updatedArtwork
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
 * Oppdaterer likes for et artwork
 * @param id
 * @param userId
 */
export const updateArtworkLikes = async (id: string, userId: string) => {
  try {
    const artworkRef = doc(db, ARTWORKS_COLLECTION, id);
    const artworkSnapshot = await getDoc(artworkRef);

    if (!artworkSnapshot.exists()) {
      console.warn(
        "Ingen kunstverk funnet for oppdatering av likes med ID:",
        id
      );
      return;
    }

    const artworkData = artworkSnapshot.data();
    const likes = artworkData?.likes || [];

    const updatedLikes = likes.includes(userId)
      ? likes.filter((like: string) => like !== userId)
      : [...likes, userId];

    console.log("Oppdaterte likes for ID:", id, updatedLikes);

    await updateDoc(artworkRef, { likes: updatedLikes });
  } catch (error) {
    console.error("Feil ved oppdatering av likes for kunstverk:", error);
  }
};
