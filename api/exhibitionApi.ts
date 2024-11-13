import { db } from "@/firebaseConfig";
import { Exhibition } from "@/types/exhibition";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const EXHIBITIONS_COLLECTION = "exhibitions";

export const getAllExhibitions = async (): Promise<Exhibition[]> => {
  try {
    const exhibitions = await getDocs(collection(db, EXHIBITIONS_COLLECTION));

    return exhibitions.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Exhibition;
    });
  } catch (error) {
    console.log("error fetching exhibitions", error);
    return [];
  }
};

export const getExhibitionById = async (id: string) => {
  try {
    const exhibitionDocRef = doc(db, EXHIBITIONS_COLLECTION, id);

    const exhibitionDoc = await getDoc(exhibitionDocRef);

    return exhibitionDoc.data() as Exhibition;
  } catch (error) {
    console.log("error fetching exhibition by id", error);
  }
};
