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
      console.error("Error uploading image.");
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
    console.log("Artwork saved with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving artwork:", error);
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
    console.error("Error fetching artwork from Firebase:", error);
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
    console.error("Error fetching categories:", error);
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
      console.log("No artwork found with this ID.");
    }
  } catch (error) {
    console.error("Error fetching artwork by ID:", error);
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
    console.log(`Artwork with ID ${id} is deleted.`);
  } catch (error) {
    console.error("Error deleting artwork:", error);
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
    console.log(`Artwork with ID ${id} is updated.`);
  } catch (error) {
    console.error("Error updating artwork:", error);
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
      console.warn("No artwork found when updating likes with ID:", id);
      return;
    }

    const artworkData = artworkSnapshot.data();
    const likes = artworkData?.likes || [];

    const updatedLikes = likes.includes(userId)
      ? likes.filter((like: string) => like !== userId)
      : [...likes, userId];

    console.log("Udpdated likes for ID:", id, updatedLikes);

    await updateDoc(artworkRef, { likes: updatedLikes });
  } catch (error) {
    console.error("Error updating likes for artworks:", error);
  }
};
