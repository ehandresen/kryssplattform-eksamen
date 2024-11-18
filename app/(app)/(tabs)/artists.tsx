import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import ArtistList from "../../../components/ArtistList";
import Menu from "../../../components/menu/Menu";
import { getAllArtists } from "@/api/artistApi";
import { Artist } from "@/types/artist";
import { useAccessibility } from "@/hooks/useAccessibility";

/**
 * ArtistsScreen håndterer visning av en liste over artister med muligheter for
 * søk, sortering og tilgjengelighetsinnstillinger (tekststørrelse og fargefilter).
 */
export default function ArtistsScreen() {
  // Tilgjengelighetsinnstillinger hentes fra en tilpasset hook
  const { textSize, currentColors, toggleColorBlindFilter, increaseTextSize } =
    useAccessibility();

  // State-variabler for å håndtere visning av artister, filtrering og søk
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Styrer søkemenyens synlighet
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // Holder valgt filter
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]); // Filtrert liste over artister
  const [allArtists, setAllArtists] = useState<Artist[]>([]); // Full liste over alle artister

  /**
   * useEffect henter artistdata fra Firestore ved hjelp av `getAllArtists` når
   * komponenten laster inn for første gang.
   */
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // Henter artistdata fra API
        const artistData = await getAllArtists();

        // Debugging: Logger hentede data
        console.log("Fetched artists:", artistData);

        // Validerer at dataene er en liste og oppdaterer state
        if (Array.isArray(artistData)) {
          const validatedArtists = artistData.map((artist) => ({
            ...artist,
            id: artist.id || "unknown-id", // Sikrer at alle artister har en ID
          }));
          setAllArtists(validatedArtists);
          setFilteredArtists(validatedArtists); // Setter standardvisning
        } else {
          console.error("Uventet datastruktur:", artistData); // Logger feilen hvis formatet er feil
        }
      } catch (error) {
        // Feilhåndtering for API-kall
        if (error instanceof Error) {
          console.error("Feil ved henting av artister:", error.message);
        } else {
          console.error("Ukjent feil ved henting av artister:", error);
        }
      }
    };

    fetchArtists(); // Utfører datainnhentingen
  }, []);

  /**
   * Sorterer artistene alfabetisk basert på `displayName` (A-Å).
   */
  const handleSortAZ = () => {
    try {
      const sorted = [...filteredArtists].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
      setFilteredArtists(sorted);
      console.log("Artists sorted A-Z:", sorted); // Debugging
    } catch (error) {
      console.error("Feil ved sortering:", error);
    }
  };

  /**
   * Søker etter artister basert på søkestrengen i `displayName` eller `bio`.
   * @param query Søketeksten som brukeren har skrevet inn.
   */
  const handleSearch = (query: string) => {
    try {
      const results = allArtists.filter(
        (artist) =>
          artist.displayName.toLowerCase().includes(query.toLowerCase()) ||
          artist.bio?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArtists(results);
      console.log("Search results:", results); // Debugging
    } catch (error) {
      console.error("Feil ved søk:", error);
    }
  };

  /**
   * Tilbakestiller filtreringen og viser hele listen over artister.
   */
  const handleClearAll = () => {
    try {
      setSelectedFilter(null);
      setFilteredArtists(allArtists);
      console.log("Filtrering tilbakestilt."); // Debugging
    } catch (error) {
      console.error("Feil ved tilbakestilling av filtrering:", error);
    }
  };

  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      {/* Viser den filtrerte listen over artister */}
      <View className="flex-1">
        <ArtistList artists={filteredArtists} textSize={textSize} />
      </View>

      {/* Meny for søk, sortering og tilgjengelighetsinnstillinger */}
      <Menu
        isVisible={isSearchVisible}
        onSearchPress={() => setIsSearchVisible(true)}
        onClearAll={handleClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        allArtworks={allArtists}
        setFilteredData={setFilteredArtists}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={Array.from(
          new Set(
            allArtists
              .map((artist) => artist.bio)
              .filter((bio): bio is string => !!bio)
          )
        )}
        onSortAZ={handleSortAZ} // Passer onSortAZ her
        onUploadPress={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSortDate={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </View>
  );
}
