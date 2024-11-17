import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const ARTISTS_COLLECTION = "artists";

// Data type for artist
export interface Artist {
  id?: string; // Firestore document ID (optional for new entries)
  displayName: string; // The artist's username
  email: string; // The artist's email
  profileImageUrl?: string; // Optional profile picture
  bio?: string; // Optional artist bio
  createdAt?: string; // Timestamp for when the artist was created
  updatedAt?: string; // Timestamp for when the artist was last updated
}

/**
 * Add a new artist to Firestore
 * @param artist - The artist data
 * @returns The document ID of the created artist
 */
export const addArtistToFirestore = async (
  artist: Artist
): Promise<string | void> => {
  try {
    const newArtist = {
      ...artist,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, ARTISTS_COLLECTION), newArtist);
    console.log("Artist added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding artist:", error);
  }
};

/**
 * Get all artists from Firestore
 * @returns A list of artists
 */
export const getAllArtists = async (): Promise<Artist[]> => {
  try {
    const artistDocs = await getDocs(collection(db, ARTISTS_COLLECTION));
    return artistDocs.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Artist;
    });
  } catch (error) {
    console.error("Error fetching artists from Firestore:", error);
    return [];
  }
};

/**
 * Get a single artist by ID
 * @param id - The artist's Firestore document ID
 * @returns The artist data
 */
export const getArtistById = async (id: string): Promise<Artist | void> => {
  try {
    const artistDoc = await getDoc(doc(db, ARTISTS_COLLECTION, id));
    if (artistDoc.exists()) {
      return {
        ...artistDoc.data(),
        id: artistDoc.id,
      } as Artist;
    } else {
      console.log("No such artist with ID:", id);
    }
  } catch (error) {
    console.error("Error fetching artist by ID:", error);
  }
};

/**
 * Update an artist's data in Firestore
 * @param id - The artist's Firestore document ID
 * @param updatedData - The updated artist data
 */
export const updateArtist = async (
  id: string,
  updatedData: Partial<Artist>
): Promise<void> => {
  try {
    const artistRef = doc(db, ARTISTS_COLLECTION, id);
    await updateDoc(artistRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    console.log("Artist updated with ID:", id);
  } catch (error) {
    console.error("Error updating artist:", error);
  }
};

/**
 * Delete an artist by ID
 * @param id - The artist's Firestore document ID
 */
export const deleteArtist = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ARTISTS_COLLECTION, id));
    console.log("Artist deleted with ID:", id);
  } catch (error) {
    console.error("Error deleting artist:", error);
  }
};
