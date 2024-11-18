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
    console.log("user signed in", userCredential);
    return userCredential;
  } catch (error) {
    console.log("could not sign in", error);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("successfully signed out");
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

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

    // Update the user's display name in Firebase Authentication
    await updateProfile(user, {
      displayName: username,
    });

    console.log("User signed up:", user.email);
    console.log("username:", user.displayName);

    // Add the new user to the artists collection in Firestore using the user's UID as the document ID
    const artist = {
      displayName: username,
      email: user.email || "",
      profileImageUrl: "", // Default empty profile image
      bio: "", // Default empty bio
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, ARTISTS_COLLECTION, user.uid), artist);
    console.log("Artist added to Firestore with UID:", user.uid);
  } catch (error) {
    console.error(`Error during sign-up: ${error.message}`);
  }
};
