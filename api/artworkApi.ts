import { Artwork } from "@/types/artwork";
import { uploadImageToFirebase } from "./imageApi";
import { db, getDownloadUrl } from "@/firebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

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

// TODO add delete
