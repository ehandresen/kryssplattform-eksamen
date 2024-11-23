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
    console.log("Artist lagt til med ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Feil ved oppretting av artist:", error);
    // Debugging for feilhåndtering
    console.debug("Feil oppstod med data:", artist);
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
    console.error("Feil ved henting av artister fra Firestore:", error);
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
      console.log("Ingen artist funnet med ID:", id);
    }
  } catch (error) {
    console.error("Feil ved henting av artist etter ID:", error);
    console.debug("Feil oppstod med ID:", id);
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
    console.log("Artist oppdatert med ID:", id);
  } catch (error) {
    console.error("Feil ved oppdatering av artist:", error);
    console.debug("Feil oppstod med data:", updatedData);
  }
};

/**
 * Sletter en artist fra Firestore
 * @param id
 */
export const deleteArtist = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ARTISTS_COLLECTION, id));
    console.log("Artist slettet med ID:", id);
  } catch (error) {
    console.error("Feil ved sletting av artist:", error);
    console.debug("Feil oppstod med ID:", id);
  }
};
