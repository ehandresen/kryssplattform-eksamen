import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
// we could possibly move this to an 'firebaseEnv.js' file and import it in
const firebaseConfig = {
  apiKey: "AIzaSyBRXc4SXaRCHbbJKNGBl_8KtDdQjODmWeA",
  authDomain: "kryss-exam.firebaseapp.com",
  projectId: "kryss-exam",
  storageBucket: "kryss-exam.firebasestorage.app",
  messagingSenderId: "804001097958",
  appId: "1:804001097958:web:287cd47a9d6ce3cf5eb327",
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize firebase authentication
export const auth = initializeAuth(app, {
  persistence:
    Platform.OS === "web"
      ? browserLocalPersistence
      : getReactNativePersistence(ReactNativeAsyncStorage),
});

//  Initializes firestore
export const db = getFirestore(app);

// initializes firebase storage but doesn’t export it directly.
const storage = getStorage(app);

// a helper function to create references to specific file paths in firebase storage. You call getStorageRef('path/to/file') to get a reference for that file location.
export const getStorageRef = (path) => ref(storage, path);

export const getDownloadUrl = (path) => getDownloadURL(ref(storage, path));
