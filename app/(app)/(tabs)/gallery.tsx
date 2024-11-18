import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ArtworkList from "../../../components/ArtworkList";
import Menu from "@/components/menu/Menu";
import Search from "../../../components/menu/Search";
import { getAllArtworks } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";
import { useAccessibility } from "@/hooks/useAccessibility"; // Unified accessibility hook
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

  // Tilbakestiller filtreringen og viser hele listen med kunstverk.

  // const handleClearAll = () => {
  //   try {
  //     setSelectedFilter(null);
  //     setFilteredData(allArtworks);
  //     console.log("Filtrering tilbakestilt."); // Debugging
  //   } catch (error) {
  //     console.error("Feil ved tilbakestilling av filtrering:", error);
  //   }
  // };

  return (
    <View className={`flex-1 p-4 bg-${currentColors.background}`}>
      {/* Viser listen over filtrerte kunstverk */}
      <View className="flex-1">
        <ArtworkList data={filteredData} textSize={textSize} />
      </View>

      <Menu
        sortTitle={true}
        onSortAZ={() => {}}
        onSortZA={() => {}}
        onClearAll={() => {}}
        onIncreaseTextSize={increaseTextSize}
        onEnableColorBlindFilter={toggleColorBlindFilter}
        onSearchPress={() => setIsSearchVisible(!isSearchVisible)}
        onUploadPress={() => setIsUploadVisible(!isUploadVisible)}
        isVisible={true}
        allArtworks={allArtworks}
        setFilteredData={setFilteredData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={[]}
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
