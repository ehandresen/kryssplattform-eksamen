/**
 * CRUD-operasjoner (Create, Read, Update, Delete)
 * for å håndtere "Artist" i Firebase.
 */

import { Artist } from "@/types/artist";
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

/**
 * Legger til en ny artist i Firestore
 * @param artist
 * @returns
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
    console.error("Error creating artist:", error);
    // Debugging for feilhåndtering
    console.debug("Error with data:", artist);
  }
};

/**
 * Henter alle artister fra Firestore
 * @returns Liste over artister
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
    console.error("Error fetching artists from Firebase:", error);
    return [];
  }
};

/**
 * Henter én artist basert på ID
 * @param id
 * @returns
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
      console.log("No artist found with ID:", id);
    }
  } catch (error) {
    console.error("Error fetching artist by ID:", error);
    console.debug("Error occured with ID:", id);
  }
};

/**
 * Oppdaterer dataene til en artist i Firestore
 * @param id
 * @param updatedData
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
    console.debug("Error occured with data:", updatedData);
  }
};

/**
 * Sletter en artist fra Firestore
 * @param id
 */
export const deleteArtist = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ARTISTS_COLLECTION, id));
    console.log("Artist deleted with ID:", id);
  } catch (error) {
    console.error("Error with deleting artist artist:", error);
    console.debug("Error occured with ID:", id);
  }
};
