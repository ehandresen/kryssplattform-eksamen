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

// Navn på Firestore-kolleksjonen for artister
export const ARTISTS_COLLECTION = "artists";

// Definerer en "type" for artistdata
export interface Artist {
  id: string; // ID for dokumentet i Firestore (valgfritt for nye oppføringer)
  displayName: string; // Brukernavn for artisten
  email: string; // E-postadresse for artisten
  profileImageUrl?: string; // Valgfritt: URL til profilbildet
  bio?: string; // Valgfritt: Artistens bio
  createdAt?: string; // Når artisten ble opprettet (tidspunkt)
  updatedAt?: string; // Når artisten sist ble oppdatert (tidspunkt)
}

/**
 * Legger til en ny artist i Firestore
 * @param artist - Artistdata som skal lagres
 * @returns Dokument-IDen til den nye artisten
 */
export const addArtistToFirestore = async (
  artist: Artist
): Promise<string | void> => {
  try {
    const newArtist = {
      ...artist,
      createdAt: new Date().toISOString(), // Legger til opprettelsestidspunkt
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
        id: doc.id, // Legger til dokument-ID i returdataene
      } as Artist;
    });
  } catch (error) {
    console.error("Feil ved henting av artister fra Firestore:", error);
    return [];
  }
};

/**
 * Henter én artist basert på ID
 * @param id - Firestore-dokument-ID for artisten
 * @returns Artistdata eller undefined hvis artisten ikke finnes
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
 * @param id - Firestore-dokument-ID for artisten
 * @param updatedData - De oppdaterte dataene
 */
export const updateArtist = async (
  id: string,
  updatedData: Partial<Artist>
): Promise<void> => {
  try {
    const artistRef = doc(db, ARTISTS_COLLECTION, id);
    await updateDoc(artistRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(), // Legger til tidspunkt for oppdatering
    });
    console.log("Artist oppdatert med ID:", id);
  } catch (error) {
    console.error("Feil ved oppdatering av artist:", error);
    console.debug("Feil oppstod med data:", updatedData);
  }
};

/**
 * Sletter en artist fra Firestore
 * @param id - Firestore-dokument-ID for artisten
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
