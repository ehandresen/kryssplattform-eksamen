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

type FilterProps = {
  visible: boolean;
  onClose: () => void;
  allArtworks: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  hashtags: string[];
};

const Filter = ({
  visible,
  onClose,
  allArtworks,
  setFilteredData,
  selectedFilter,
  setSelectedFilter,
  hashtags,
}: FilterProps) => {
  const handleApplyFilter = (filter: string | null) => {
    setFilteredData(applyFilter(allArtworks, filter));
    setSelectedFilter(filter);
    onClose();
  };

  const handleClearFilter = () => {
    setFilteredData(clearFilter(allArtworks));
    setSelectedFilter(null);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.listContainer}>
          <Text style={styles.title}>Select a Category</Text>
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
          <TouchableOpacity
            onPress={handleClearFilter}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#d19898",
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
    maxHeight: 200,
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
