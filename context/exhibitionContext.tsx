// ExhibitionContext.js
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as exhibitionApi from "@/api/exhibitionApi";
import { Exhibition } from "@/types/exhibition";

type ExhibitionContextType = {
  exhibitions: Exhibition[];
  getExhibitionById: (id: string) => Promise<Exhibition | undefined>;
  isLoading: boolean;
};

export const ExhibitionContext = createContext<
  ExhibitionContextType | undefined
>(undefined);

export const ExhibitionProvider = ({ children }: { children: ReactNode }) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const fetchedExhibitions = await exhibitionApi.getAllExhibitions();
      console.log("fetched exhibitions from context:", fetchedExhibitions);
      setExhibitions(fetchedExhibitions);
    } catch (error) {
      console.log("Error fetching exhibitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExhibitionById = async (id: string) => {
    try {
      const fetchedExhibition = await exhibitionApi.getExhibitionById(id);

      return fetchedExhibition;
    } catch (error) {
      console.log("error fetching exhibition by id", error);
    }
  };

  return (
    <ExhibitionContext.Provider
      value={{ exhibitions, getExhibitionById, isLoading }}
    >
      {children}
    </ExhibitionContext.Provider>
  );
};
