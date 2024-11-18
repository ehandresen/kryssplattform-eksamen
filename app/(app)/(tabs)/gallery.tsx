import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "../../../components/menu/Menu";
import Search from "../../../components/menu/Search";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook
import { sortAZ, sortDate } from "@/utils/functions/sort";
import Upload from "../../../components/menu/Upload";

/**
 * GalleryScreen viser en liste med kunstverk og gir brukeren funksjoner som
 * søk, sortering og opplasting. Skjermen er optimalisert med tilgjengelighetsfunksjoner.
 */
export default function GalleryScreen() {
  // Tilgjengelighetsinnstillinger fra en tilpasset hook
  const { textSize, currentColors, toggleColorBlindFilter, increaseTextSize } =
    useAccessibility();

  // State for å håndtere visning og filtrering
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Søkemodus
  const [isUploadVisible, setIsUploadVisible] = useState(false); // Opplastingsmodus
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // Valgt filter
  const [filteredData, setFilteredData] = useState<Artwork[]>([]); // Filtrert kunstverkliste
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]); // Full kunstverkliste

  /**
   * Henter alle kunstverk fra Firestore ved hjelp av `getAllArtworks` når
   * komponenten laster inn første gang.
   */
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const artworks = await getAllArtworks();
        console.log("Fetched artworks:", artworks); // Debugging
        setAllArtworks(artworks);
        setFilteredData(artworks); // Standardvisning
      } catch (error) {
        console.error("Feil ved henting av kunstverk:", error); // Feilhåndtering
      }
    };

    fetchArtworks();
  }, []);

  /**
   * Sorterer kunstverk alfabetisk basert på tittel (A-Å).
   */
  const handleSortAZ = () => {
    try {
      const sorted = sortAZ(filteredData);
      setFilteredData(sorted);
      console.log("Sorted artworks A-Z:", sorted); // Debugging
    } catch (error) {
      console.error("Feil ved alfabetisk sortering:", error);
    }
  };

  /**
   * Sorterer kunstverk basert på dato.
   */
  const handleSortDate = () => {
    try {
      const sorted = sortDate(filteredData);
      setFilteredData(sorted);
      console.log("Sorted artworks by date:", sorted); // Debugging
    } catch (error) {
      console.error("Feil ved dato-sortering:", error);
    }
  };

  /**
   * Tilbakestiller filtreringen og viser hele listen med kunstverk.
   */
  const handleClearAll = () => {
    try {
      setSelectedFilter(null);
      setFilteredData(allArtworks);
      console.log("Filtrering tilbakestilt."); // Debugging
    } catch (error) {
      console.error("Feil ved tilbakestilling av filtrering:", error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      {/* Viser listen over filtrerte kunstverk */}
      <View style={styles.listContainer}>
        <ArtworkList data={filteredData} textSize={textSize} />
      </View>

      {/* Meny for søk, sortering, opplasting og tilgjengelighetsfunksjoner */}
      <Menu
        isVisible
        onSearchPress={() => setIsSearchVisible(true)}
        onUploadPress={() => setIsUploadVisible(true)}
        onClearAll={handleClearAll}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        allArtworks={allArtworks}
        setFilteredData={setFilteredData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={Array.from(
          new Set(
            allArtworks
              .map((artwork) => artwork.category || "") // Bytter undefined med en tom streng
              .filter((category) => category !== "") // Fjerner tomme strenger
          )
        )}
        onSortAZ={handleSortAZ}
        onSortDate={handleSortDate}
      />

      {/* Komponent for opplasting av kunstverk */}
      {isUploadVisible && (
        <Upload
          visible={isUploadVisible}
          onClose={() => setIsUploadVisible(false)}
        />
      )}

      {/* Komponent for søk etter kunstverk */}
      {isSearchVisible && (
        <Search
          allArtworks={allArtworks}
          setFilteredData={setFilteredData}
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});
