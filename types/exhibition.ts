export type Exhibition = {
  id: string;
  title: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  artworks: string[]; // array of artwork ids
  startDate: string;
  endDate: string;
};
