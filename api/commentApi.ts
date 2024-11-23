/**
 * CRUD-operasjoner (Create, Read, Update, Delete)
 * for å håndtere kommentarer i Firebase.
 */

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

const COMMENTS_COLLECTION = "comments";

/**
 * Legger til en kommentar i Firestore
 * og oppdaterer kunstverket den er knyttet til
 * @param artworkId
 * @param comment
 * @returns
 */
export const addComment = async (artworkId: string, comment: Comment) => {
  try {
    const commentRef = await addDoc(
      collection(db, COMMENTS_COLLECTION),
      comment
    );

    const artworkRef = doc(db, ARTWORKS_COLLECTION, artworkId);

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
 * @param ids
 * @returns
 */
export const getCommentsByIds = async (ids: string[]) => {
  try {
    const response = await Promise.all(
      ids.map((id) => {
        return getDoc(doc(db, COMMENTS_COLLECTION, id));
      })
    );

    return response
      .map((doc) => {
        if (!doc.exists()) {
          console.warn(`Kommentar med ID ${doc.id} finnes ikke.`);
          return null;
        }
        return { id: doc.id, comment: doc.data() } as CommentObject;
      })
      .filter((comment) => comment !== null);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved henting av kommentarer:", error.message);
    } else {
      console.error("Ukjent feil ved henting av kommentarer:", error);
    }
  }
};

/**
 * Sletter en kommentar fra Firestore
 * og oppdaterer kunstverket den er knyttet til
 * @param commentId
 * @param artworkId
 */
export const deleteComment = async (commentId: string, artworkId: string) => {
  try {
    const artworkRef = doc(db, ARTWORKS_COLLECTION, artworkId);

    await updateDoc(artworkRef, {
      comments: arrayRemove(commentId),
    });

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
