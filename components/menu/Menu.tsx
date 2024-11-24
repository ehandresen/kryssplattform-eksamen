import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Accessibility from "./Accessibility";
import Filter from "./Filter";
import Sort from "./Sort";
import Search from "./Search";
import Upload from "./Upload";

type MenuProps = {
  sortTitle: boolean;
  onSortAZ: () => void;
  onSortZA: () => void;
  onIncreaseTextSize: () => void;
  onEnableColorBlindFilter: () => void;
  onUploadPress: () => void;
  isVisible: boolean;
  allData: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  isSearchVisible: boolean;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isUploadVisible: boolean;
  setIsUploadVisible: React.Dispatch<React.SetStateAction<boolean>>;
  searchKey: string;
};

const Menu = ({
  sortTitle,
  onIncreaseTextSize,
  onEnableColorBlindFilter,
  isVisible,
  allData,
  setFilteredData,
  selectedFilter,
  setSelectedFilter,
  isSearchVisible,
  setIsSearchVisible,
  isUploadVisible,
  setIsUploadVisible,
  searchKey,
}: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const onFilterPress = () => setIsFilterVisible(true);

  const closeFilter = () => setIsFilterVisible(false);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Main menu button */}
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

      {/* Menu content */}
      {isMenuOpen && (
        <>
          {/* Conditional rendering based on sortTitle */}
          {sortTitle && (
            <>
              <TouchableOpacity
                onPress={onFilterPress}
                style={styles.filterButton}
              >
                <AntDesign name="filter" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsUploadVisible(true)} // Show upload modal
                style={styles.uploadButton}
              >
                <AntDesign name="plus" size={24} color="black" />
              </TouchableOpacity>
            </>
          )}

          {/* Search button */}
          <TouchableOpacity
            onPress={() => setIsSearchVisible(!isSearchVisible)}
            style={styles.searchButton}
          >
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>

          {/* Render the Search component */}
          {isSearchVisible && (
            <Search
              allData={allData}
              setFilteredData={setFilteredData}
              isSearchVisible={isSearchVisible}
              setIsSearchVisible={setIsSearchVisible}
              searchKey={searchKey} // Dynamically pass the search key
            />
          )}

          {/* Sorting component */}
          <Sort
            filteredData={allData}
            setFilteredData={setFilteredData}
            style={styles.sortButton}
            sortTitle={sortTitle}
          />

          {/* Accessibility options */}
          <Accessibility
            onIncreaseTextSize={onIncreaseTextSize}
            onEnableColorBlindFilter={onEnableColorBlindFilter}
            style={styles.accessibilityButton}
          />
        </>
      )}

      {/* Filter modal */}
      <Filter
        visible={isFilterVisible}
        onClose={closeFilter}
        allArtworks={allData}
        setFilteredData={setFilteredData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Upload modal */}
      <Upload
        visible={isUploadVisible}
        onClose={() => setIsUploadVisible(false)}
      />
    </View>
  );
};

// Stiler for komponenten
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
    zIndex: 100,
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
    bottom: 290,
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
    bottom: 150,
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

export default Menu;
