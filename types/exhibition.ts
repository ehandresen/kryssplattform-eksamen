export type Exhibition = {
  id: string;
  title: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  artworks: string[];
  startDate: string;
  endDate: string;
};
