import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// we could possibly move this to an 'firebaseEnv.js' file and import it in
const firebaseConfig = {
  apiKey: 'AIzaSyBRXc4SXaRCHbbJKNGBl_8KtDdQjODmWeA',
  authDomain: 'kryss-exam.firebaseapp.com',
  projectId: 'kryss-exam',
  storageBucket: 'kryss-exam.firebasestorage.app',
  messagingSenderId: '804001097958',
  appId: '1:804001097958:web:287cd47a9d6ce3cf5eb327',
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize firebase authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
