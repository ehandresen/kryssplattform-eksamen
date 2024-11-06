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
}
