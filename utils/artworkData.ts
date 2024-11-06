// models/ArtworkData.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ArtworkData {
  id: string;
  title: string;
  artist: string;
  image: string;
  hashtags: string[];
  description: string;
  coordinates: Coordinates;
  userID: string;
  uploadDate: string; // New field for upload date (in ISO format, e.g., "2024-11-06")
}
