// components/menu/Filter.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { applyFilter, clearFilter } from "@/utils/functions/filter";
import { Artwork } from "@/types/artwork";

/**
 * Props for Filter-komponenten
 * @param visible - Bestemmer om filtermenyen skal være synlig.
 * @param onClose - Funksjon som lukkes filtermenyen.
 * @param allArtworks - Komplett liste over kunstverk.
 * @param setFilteredData - Funksjon for å oppdatere filtrert data.
 * @param selectedFilter - Gjeldende valgte filter.
 * @param setSelectedFilter - Funksjon for å oppdatere valgte filter.
 * @param hashtags - Liste over tilgjengelige filterkategorier (hashtags).
 */
type FilterProps = {
  visible: boolean;
  onClose: () => void;
  allArtworks: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  hashtags: string[];
};

/**
 * Filter-komponent:
 * - En modal for å filtrere kunstverk etter kategori.
 * - Gir brukeren muligheten til å velge en kategori eller tilbakestille filtreringen.
 */
const Filter = ({
  visible,
  onClose,
  allArtworks,
  setFilteredData,
  selectedFilter,
  setSelectedFilter,
  hashtags,
}: FilterProps) => {
  /**
   * Funksjon for å anvende et valgt filter.
   * @param filter - Filternavn (kategori/hashtag).
   */
  const handleApplyFilter = (filter: string | null) => {
    setFilteredData(applyFilter(allArtworks, filter));
    setSelectedFilter(filter);
    onClose(); // Lukker modal etter filtrering.
  };

  /**
   * Funksjon for å tilbakestille alle filtre.
   */
  const handleClearFilter = () => {
    setFilteredData(clearFilter(allArtworks));
    setSelectedFilter(null);
    onClose(); // Lukker modal etter tilbakestilling.
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      {/* Bakgrunnsoverlay for modal */}
      <View style={styles.overlay}>
        <View style={styles.listContainer}>
          {/* Tittel */}
          <Text style={styles.title}>Select a Category</Text>
          {/* Liste over tilgjengelige filter */}
          <ScrollView style={styles.scrollView}>
            {hashtags.map((hashtag) => (
              <TouchableOpacity
                key={hashtag}
                onPress={() => handleApplyFilter(hashtag)}
                style={styles.hashtagButton}
              >
                <Text style={styles.hashtagText}>{hashtag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Knapp for å tilbakestille filtre */}
          <TouchableOpacity
            onPress={handleClearFilter}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Filter</Text>
          </TouchableOpacity>
          {/* Knapp for å lukke filtermodal */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Stiler for Filter-komponenten
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Halvtransparent mørkt bakgrunnslag
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#d19898", // Bakgrunnsfarge for modal
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scrollView: {
    width: "100%",
    maxHeight: 200, // Maks høyde for å unngå at listen blir for lang
    marginBottom: 15,
  },
  hashtagButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  hashtagText: {
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "grey",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Filter;
