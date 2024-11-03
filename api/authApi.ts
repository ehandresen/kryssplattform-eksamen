import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

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
    console.log('user signed in', userCredential);
    return userCredential;
  } catch (error) {
    console.log('could not sign in', error);
  }
};

export const signOut = async () => {
  await auth.signOut().then(() => console.log('successfully signed out'));
};
