import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";

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
  await auth.signOut().then(() => console.log("successfully signed out"));
};

export const signUp = (email: string, password: string, username: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      console.log("User signed up:", userCredential.user.email);
      console.log("username:", userCredential.user.displayName);
    })
    .catch((error) => {
      console.log(`Oops! ${error.code} message: ${error.message}`);
    });
};
