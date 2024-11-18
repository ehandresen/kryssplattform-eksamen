export type Artist = {
  id: string; // Firestore document ID
  displayName: string; // Artist's username
  email: string; // Artist's email
  profileImageUrl?: string; // Optional profile picture URL
  bio?: string; // Optional artist bio
};
