import React, { createContext, ReactNode, useEffect, useState } from "react";
import * as artworkApi from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";

type ArtworkContextType = {
  artworks: Artwork[];
  getArtworkById: (id: string) => Promise<Artwork | undefined>;
  addArtwork: (artwork: Artwork) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  isLoading: boolean;
};

export const ArtworkContext = createContext<ArtworkContextType | undefined>(
  undefined
);

export const ArtworkProvider = ({ children }: { children: ReactNode }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const fetchedArtworks = await artworkApi.getAllArtworks();
      console.log("Fetched artworks from context:", fetchedArtworks);
      setArtworks(fetchedArtworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getArtworkById = async (id: string) => {
    try {
      const fetchedArtwork = await artworkApi.getArtworkById(id);
      return fetchedArtwork;
    } catch (error) {
      console.error("Error fetching artwork by id:", error);
    }
  };

  const addArtwork = async (artwork: Artwork) => {
    try {
      await artworkApi.addArtworkToFirestore(artwork);
      // Refresh the artwork list after adding a new artwork
      await fetchArtworks();
    } catch (error) {
      console.error("Error adding artwork:", error);
    }
  };

  const deleteArtwork = async (id: string) => {
    try {
      await artworkApi.deleteArtworkById(id);
      // Refresh the artwork list after deleting an artwork
      setArtworks((prevArtworks) =>
        prevArtworks.filter((artwork) => artwork.id !== id)
      );
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  return (
    <ArtworkContext.Provider
      value={{ artworks, getArtworkById, addArtwork, deleteArtwork, isLoading }}
    >
      {children}
    </ArtworkContext.Provider>
  );
};
