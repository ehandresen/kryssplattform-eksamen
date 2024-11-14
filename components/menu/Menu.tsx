import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Clear from "./Clear";
import AccessibilityBtn from "./AccessibilityBtn";
import Filter from "./Filter";
import Sort from "./Sort";
import Upload from "./Upload"; // Import the new Upload component

type MenuProps = {
  onClearAll: () => void;
  onIncreaseTextSize: () => void;
  onEnableColorBlindFilter: () => void;
  onSearchPress: () => void;
  isVisible: boolean;
  allArtworks: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  hashtags: string[];
};

export default function Menu({
  onClearAll,
  onIncreaseTextSize,
  onEnableColorBlindFilter,
  onSearchPress,
  isVisible,
  allArtworks,
  setFilteredData,
  selectedFilter,
  setSelectedFilter,
  hashtags,
}: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false); // State for upload visibility

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const onFilterPress = () => setIsFilterVisible(true);
  const closeFilter = () => setIsFilterVisible(false);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleMenu}
        activeOpacity={0.7}
        style={styles.menuButton}
      >
        <View
          style={[
            styles.iconButton,
            { backgroundColor: isMenuOpen ? "#ff4d4d" : "#e0b3b3" },
          ]}
        >
          {isMenuOpen ? (
            <AntDesign name="close" size={24} color="white" />
          ) : (
            <Entypo name="menu" size={24} color="black" />
          )}
        </View>
      </TouchableOpacity>

      {isMenuOpen && (
        <>
          <Clear onClearAll={onClearAll} style={styles.clearAllButton} />
          <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <AntDesign name="filter" size={24} color="black" />
          </TouchableOpacity>
          <Sort
            filteredData={allArtworks}
            setFilteredData={setFilteredData}
            style={styles.sortButton}
          />
          <AccessibilityBtn
            onIncreaseTextSize={onIncreaseTextSize}
            onEnableColorBlindFilter={onEnableColorBlindFilter}
            style={styles.accessibilityButton}
          />
          {/* Instead of UploadBtn, we now directly trigger the Upload component */}
          <TouchableOpacity
            onPress={() => setIsUploadVisible(true)}
            style={styles.uploadButton}
          >
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        </>
      )}

      <Filter
        visible={isFilterVisible}
        onClose={closeFilter}
        allArtworks={allArtworks}
        setFilteredData={setFilteredData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        hashtags={hashtags}
      />

      {/* Render the Upload component */}
      <Upload
        visible={isUploadVisible}
        onClose={() => setIsUploadVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
  },
  menuButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  clearAllButton: {
    position: "absolute",
    bottom: 40,
    right: 80,
    backgroundColor: "#e0b3b3",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    position: "absolute",
    bottom: 80,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    position: "absolute",
    bottom: 150,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButton: {
    position: "absolute",
    bottom: 220,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  accessibilityButton: {
    position: "absolute",
    bottom: 290,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    position: "absolute",
    bottom: 360,
    right: 0,
    backgroundColor: "#e0b3b3",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
