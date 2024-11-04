// app/api/artworkApi.ts

// Define the type for the artwork data
export type ArtworkData = {
  id: string;
  imageURL: string;
  title: string;
  description: string;
  artist: string;
  hashtags?: string[];
};

// Simulate fetching data from an API or local JSON
export const fetchArtworks = async (): Promise<ArtworkData[]> => {
  const mockArtworks: ArtworkData[] = [
    {
      id: "1",
      imageURL: "https://example.com/path/to/real-image1.jpg",
      title: "Sunset over the Mountains",
      description: "A beautiful sunset over the mountains.",
      artist: "John Doe",
      hashtags: ["#sunset", "#mountains", "#art"],
    },
    {
      id: "2",
      imageURL: "https://example.com/path/to/real-image2.jpg",
      title: "The Blue Ocean",
      description: "A peaceful view of the deep blue ocean.",
      artist: "Jane Smith",
      hashtags: ["#ocean", "#sea", "#art"],
    },
    {
      id: "3",
      imageURL: "https://example.com/path/to/real-image3.jpg",
      title: "Cityscape",
      description: "A bustling cityscape full of life.",
      artist: "Alex Johnson",
      hashtags: ["#city", "#urban", "#art"],
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockArtworks);
    }, 1000);
  });
};

// Function to fetch artwork by ID
export const fetchArtworkById = async (
  id: string
): Promise<ArtworkData | null> => {
  const artworks = await fetchArtworks();
  const artwork = artworks.find((art) => art.id === id);
  return artwork || null;
};
