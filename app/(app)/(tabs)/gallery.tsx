import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "@/components/menu/Menu";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook

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

  const handleUploadPress = () => {
    setIsUploadVisible(!isUploadVisible);
  };

  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      <Menu
        sortTitle={true}
        onSortAZ={() => {}}
        onSortZA={() => {}}
        allArtworks={allArtworks}
        setFilteredData={setFilteredData}
        isSearchVisible={isSearchVisible}
        setIsSearchVisible={setIsSearchVisible}
        isUploadVisible={isUploadVisible} // Pass upload visibility state
        onUploadPress={handleUploadPress}
        setIsUploadVisible={setIsUploadVisible} // Pass upload setter
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        isVisible={true} // Assuming the menu is always visible, set this accordingly
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={[]} // You can pass hashtags if needed
      />

      {/* Display filtered artwork list */}
      <ArtworkList data={filteredData} textSize={textSize} />
    </View>
  );
}
