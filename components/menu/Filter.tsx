import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { getUniqueCategories } from "@/api/artworkApi";
import { Artwork } from "@/types/artwork";

type FilterProps = {
  visible: boolean;
  onClose: () => void;
  allArtworks: Artwork[];
  setFilteredData: React.Dispatch<React.SetStateAction<Artwork[]>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
};

const Filter: React.FC<FilterProps> = ({
  visible,
  onClose,
  setFilteredData,
  allArtworks,
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  // Hent unike kategorier fra databasen
  useEffect(() => {
    const fetchCategories = async () => {
      const uniqueCategories = await getUniqueCategories();
      setCategories(uniqueCategories);
    };
    fetchCategories();
  }, []);

  const handleApplyFilter = (category: string) => {
    const filtered = allArtworks.filter(
      (artwork) => artwork.category === category
    );
    setFilteredData(filtered);
    onClose();
  };

  const handleClearFilter = () => {
    setFilteredData(allArtworks);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Velg en kategori:</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryButton}
              onPress={() => handleApplyFilter(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearFilter}
          >
            <Text style={styles.clearButtonText}>Fjern filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Lukk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    textAlign: "center",
  },
  clearButton: {
    padding: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
    marginTop: 10,
  },
  clearButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Filter;
