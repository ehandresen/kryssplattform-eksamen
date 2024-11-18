import { db } from "@/firebaseConfig";
import { Comment, CommentObject } from "@/types/comment";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ARTWORKS_COLLECTION } from "./artworkApi";

const COMMENTS_COLLECTION = "comments"; // Navn på Firestore-kolleksjonen for kommentarer

/**
 * Legger til en kommentar i Firestore og oppdaterer kunstverket den er knyttet til
 * @param artworkId - ID for kunstverket som kommentaren er tilknyttet
 * @param comment - Kommentardata som skal lagres
 * @returns ID for den nye kommentaren
 */
export const addComment = async (artworkId: string, comment: Comment) => {
  try {
    // Legg til kommentaren i "comments"-kolleksjonen i Firestore
    const commentRef = await addDoc(
      collection(db, COMMENTS_COLLECTION),
      comment
    );

    // Referanse til spesifikt kunstverksdokument basert på oppgitt ID
    const artworkRef = doc(db, ARTWORKS_COLLECTION, artworkId);

    // Legg til den nye kommentarens ID i kunstverkets 'comments'-array (unngår duplikater)
    await updateDoc(artworkRef, {
      comments: arrayUnion(commentRef.id),
    });

    console.log("Kommentar lagt til med ID:", commentRef.id);
    return commentRef.id;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved legging til kommentar:", error.message);
    } else {
      console.error("Ukjent feil ved legging til kommentar:", error);
    }
  }
};

/**
 * Henter kommentarer basert på en liste med ID-er
 * @param ids - Liste over kommentar-ID-er
 * @returns Liste med kommentarobjekter
 */
export const getCommentsByIds = async (ids: string[]) => {
  try {
    // Hent alle kommentarer parallelt basert på ID-er
    const response = await Promise.all(
      ids.map((id) => {
        return getDoc(doc(db, COMMENTS_COLLECTION, id));
      })
    );

    // Map dokumenter til en liste med kommentarobjekter
    return response
      .map((doc) => {
        if (!doc.exists()) {
          console.warn(`Kommentar med ID ${doc.id} finnes ikke.`);
          return null;
        }
        return { id: doc.id, comment: doc.data() } as CommentObject;
      })
      .filter((comment) => comment !== null); // Fjern null-verdier for manglende dokumenter
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved henting av kommentarer:", error.message);
    } else {
      console.error("Ukjent feil ved henting av kommentarer:", error);
    }
  }
};

/**
 * Sletter en kommentar fra Firestore og oppdaterer kunstverket den er knyttet til
 * @param commentId - ID for kommentaren som skal slettes
 * @param artworkId - ID for kunstverket kommentaren er tilknyttet
 */
export const deleteComment = async (commentId: string, artworkId: string) => {
  try {
    // Referanse til kunstverket som kommentaren er knyttet til
    const artworkRef = doc(db, ARTWORKS_COLLECTION, artworkId);

    // Fjern kommentar-ID fra kunstverkets 'comments'-array
    await updateDoc(artworkRef, {
      comments: arrayRemove(commentId),
    });

    // Slett kommentaren fra "comments"-kolleksjonen
    await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));

    console.log("Kommentar slettet med ID:", commentId);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved sletting av kommentar:", error.message);
    } else {
      console.error("Ukjent feil ved sletting av kommentar:", error);
    }
  }
};
