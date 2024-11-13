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

  return (
    <ExhibitionContext.Provider value={{ exhibitions, isLoading }}>
      {children}
    </ExhibitionContext.Provider>
  );
};
