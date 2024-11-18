import { db } from "@/firebaseConfig";
import { Exhibition } from "@/types/exhibition";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const EXHIBITIONS_COLLECTION = "exhibitions"; // Navn på Firestore-kolleksjonen for utstillinger

/**
 * Henter alle utstillinger fra Firestore
 * @returns En liste med alle utstillinger
 */
export const getAllExhibitions = async (): Promise<Exhibition[]> => {
  try {
    const exhibitions = await getDocs(collection(db, EXHIBITIONS_COLLECTION));

    // Map hver dokument til et Exhibition-objekt med ID
    return exhibitions.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Exhibition;
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved henting av utstillinger:", error.message);
    } else {
      console.error("Ukjent feil ved henting av utstillinger:", error);
    }
    return [];
  }
};

/**
 * Henter en spesifikk utstilling basert på ID
 * @param id - Firestore-dokument-ID for utstillingen
 * @returns Data for utstillingen
 */
export const getExhibitionById = async (
  id: string
): Promise<Exhibition | null> => {
  try {
    const exhibitionDocRef = doc(db, EXHIBITIONS_COLLECTION, id);

    const exhibitionDoc = await getDoc(exhibitionDocRef);

    if (exhibitionDoc.exists()) {
      return {
        ...exhibitionDoc.data(),
        id: exhibitionDoc.id,
      } as Exhibition;
    } else {
      console.warn(`Ingen utstilling funnet med ID: ${id}`);
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved henting av utstilling med ID:", error.message);
    } else {
      console.error("Ukjent feil ved henting av utstilling med ID:", error);
    }
    return null;
  }
};
