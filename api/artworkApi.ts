import { Artwork } from '@/types/artwork';
import { uploadImageToFirebase } from './imageApi';
import { db, getDownloadUrl } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export const addArtworkToFirestore = async (artwork: Artwork) => {
  try {
    // upload the image
    const firebaseImage = await uploadImageToFirebase(artwork.imageUrl);

    if (firebaseImage === 'error') {
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
      collection(db, 'artworks'),
      artworkWithNewImageUrl
    );
    console.log('document written with ID:', docRef.id);
  } catch (error) {
    console.log('error adding document', error);
  }
};
