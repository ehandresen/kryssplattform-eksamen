// Updated MenuBtn with ClearAllBtn

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import SearchBtn from "./search/SearchBtn";
import UploadBtn from "./upload/UploadBtn";
import FilterBtn from "./filter/FilterBtn";
import SortBtn from "./SortBtn";
import ClearAllBtn from "./ClearAllBtn";

type MenuBtnProps = {
  onUploadPress: () => void;
  onSearchPress: () => void;
  onFilterPress: () => void;
  onSortPress: () => void;
  onClearAll: () => void; // Add this prop for clearing
  isVisible: boolean;
};

export default function MenuBtn({
  onUploadPress,
  onSearchPress,
  onFilterPress,
  onSortPress,
  onClearAll,
  isVisible,
}: MenuBtnProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {isMenuOpen && (
        <>
          <SearchBtn onPress={onSearchPress} style={{ bottom: 255 }} />
          <FilterBtn onPress={onFilterPress} style={{ bottom: 190 }} />
          <SortBtn onPress={onSortPress} style={{ bottom: 125 }} />
          <UploadBtn onPress={onUploadPress} style={{ bottom: 60 }} />
          <ClearAllBtn onPress={onClearAll} style={{ left: -110 }} />
        </>
      )}
      <TouchableOpacity onPress={toggleMenu} activeOpacity={0.7}>
        <View
          style={[
            styles.menuButton,
            { backgroundColor: isMenuOpen ? "#ff4d4d" : "#e0b3b3" }, // Red when open, original color when closed
          ]}
        >
          {isMenuOpen ? (
            <AntDesign name="close" size={24} color="white" /> // "X" icon when menu is open
          ) : (
            <Entypo name="menu" size={24} color="black" /> // Hamburger icon when menu is closed
          )}
        </View>
      </TouchableOpacity>
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
});
