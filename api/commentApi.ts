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

export const addComment = async (artworkId: string, comment: Comment) => {
  try {
    // add comment to 'comments' collection in firestore
    const commentRef = await addDoc(
      collection(db, COMMENTS_COLLECTION),
      comment
    );

    // gets reference to a specific artwork doc, based on provided id
    const artworkRef = doc(db, ARTWORKS_COLLECTION, artworkId);

    // add the new comment id to the artworks 'comments' array, ensuring no duplicates with arrayUnion()
    await updateDoc(artworkRef, {
      comments: arrayUnion(commentRef.id),
    });
    console.log("added comment with id:", commentRef.id);

    return commentRef.id;
  } catch (error) {
    console.log("error adding comment", error);
  }
};

export const getCommentsByIds = async (ids: string[]) => {
  try {
    const response = await Promise.all(
      ids.map((id) => {
        return getDoc(doc(db, COMMENTS_COLLECTION, id));
      })
    );

    return response.map((doc) => {
      return { id: doc.id, comment: doc.data() } as CommentObject;
    });
  } catch (error) {
    console.log("error fetching comments", error);
  }
};

export const deleteComment = async (commentId: string, postId: string) => {
  try {
    const artworkRef = doc(db, ARTWORKS_COLLECTION, postId);
    await updateDoc(artworkRef, {
      comments: arrayRemove(commentId),
    });
    await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
    console.log("successfully deleted comment");
  } catch (error) {
    console.log("error deleting document: ", error);
  }
};
