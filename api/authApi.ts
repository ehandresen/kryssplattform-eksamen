import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const ARTISTS_COLLECTION = "artists"; // Navn på Firestore-kolleksjonen for artister

/**
 * Logger en bruker inn med e-post og passord
 * @param email - Brukerens e-post
 * @param password - Brukerens passord
 * @returns UserCredential eller void hvis innlogging mislykkes
 */
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential | void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Bruker logget inn:", userCredential.user.email);
    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved innlogging:", error.message);
    } else {
      console.error("Ukjent feil ved innlogging:", error);
    }
  }
};

/**
 * Logger en bruker ut fra Firebase Authentication
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("Bruker logget ut.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved utlogging:", error.message);
    } else {
      console.error("Ukjent feil ved utlogging:", error);
    }
  }
};

/**
 * Registrerer en ny bruker og legger dem til i Firestore
 * @param email - Brukerens e-post
 * @param password - Brukerens passord
 * @param username - Brukerens ønskede brukernavn
 */
export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<void> => {
  try {
    // Opprett en ny bruker i Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Oppdater brukerens profil med visningsnavn
    await updateProfile(user, {
      displayName: username,
    });

    console.log("Ny bruker opprettet:", user.email);
    console.log("Brukernavn satt til:", user.displayName);

    // Opprett et nytt dokument i Firestore for den nye artisten
    const artist = {
      displayName: username,
      email: user.email || "", // Standard tom e-post hvis e-post mangler
      profileImageUrl: "", // Standard tom URL for profilbilde
      bio: "", // Standard tom bio
      createdAt: new Date().toISOString(), // Tidspunkt for opprettelse
    };

    await setDoc(doc(db, ARTISTS_COLLECTION, user.uid), artist);
    console.log("Artist lagt til i Firestore med UID:", user.uid);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Feil ved registrering:", error.message);
    } else {
      console.error("Ukjent feil ved registrering:", error);
    }
  }
};
