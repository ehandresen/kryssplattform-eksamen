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

export const addArtworkToFirestore = async (artwork: Artwork) => {
  try {
    // upload the image
    const firebaseImage = await uploadImageToFirebase(artwork.imageUrl);

    if (firebaseImage === "error") {
      return;
    }

    // get new url (hosted on firebase) to access this image
    const artworkImageDownloadUrl = await getDownloadUrl(firebaseImage);

    // create new artwork object with updated URL
    const artworkWithNewImageUrl: Artwork = {
      ...artwork,
      imageUrl: artworkImageDownloadUrl,
    };

    // save to 'artworks' firestore collection
    const docRef = await addDoc(
      collection(db, ARTWORKS_COLLECTION),
      artworkWithNewImageUrl
    );
    console.log("document written with ID:", docRef.id);
  } catch (error) {
    console.log("error adding document", error);
  }
};

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
    console.log("error fetching artworks from firebase", error);
    return [];
  }
};

export const getArtworkById = async (id: string) => {
  try {
    const artworkDoc = await getDoc(doc(db, ARTWORKS_COLLECTION, id));
    console.log("artwork by id:", id);

    return {
      ...artworkDoc.data(),
      id: artworkDoc.id,
    } as Artwork;
  } catch (error) {
    console.log("error fetching post with id:", id);
  }
};

export const deleteArtwork = async (id: string) => {
  try {
    await deleteDoc(doc(db, ARTWORKS_COLLECTION, id));
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("error removing document: ", error);
  }
};

export const updateArtworkLikes = async (id: string, userId: string) => {
  try {
    // reference to the artwork document in Firestore
    const artworkRef = doc(db, ARTWORKS_COLLECTION, id);
    const artworkSnapshot = await getDoc(artworkRef);
    const artworkData = artworkSnapshot.data();

    // set likes to empty array if it does not exist
    const likes = artworkData?.likes;
    console.log("likes:", likes);

    // update like based on whether the userId is already in the likes array
    const updatedLikes = likes.includes(userId)
      ? likes.filter((like: string) => like !== userId) // remove userId from likes
      : [...likes, userId]; // add userId to likes

    console.log("updated likes:", updatedLikes);

    // update firestore document with the new likes array
    await updateDoc(artworkRef, { likes: updatedLikes });
  } catch (error) {
    console.error("error updating like:", error);
  }
};
