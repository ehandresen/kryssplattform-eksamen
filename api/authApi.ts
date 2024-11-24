/*
 * Kode tilpasset "authApi" av Brage Hveding Ersdal (Foreleser) i Git-repo "Kryssplattform-HK-H24".
 * URL: https://github.com/studBrage/Kryssplattform-HK-H24
 * Dato: 22.11.2024
 */

/**
 * Autentiserings- og brukerregistrering for Firebase.
 * Innlogging, utlogging og opprettelse av nye brukere,
 * samt lagring av brukerdata i Firestore.
 */

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

const ARTISTS_COLLECTION = "artists";

/**
 * Logger en bruker inn med e-post og passord
 * @param email
 * @param password
 * @returns
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
 * @param email
 * @param password
 * @param username
 */
export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username,
    });

    console.log("Ny bruker opprettet:", user.email);
    console.log("Brukernavn satt til:", user.displayName);

    const artist = {
      displayName: username,
      email: user.email || "",
      profileImageUrl: "",
      bio: "",
      createdAt: new Date().toISOString(),
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
