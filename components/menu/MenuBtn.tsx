// components/MenuBtn.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import SearchBtn from "./search/SearchBtn";
import UploadBtn from "./upload/UploadBtn";
import FilterBtn from "./filter/FilterBtn";
import SortBtn from "./SortBtn";
import ClearAllBtn from "./ClearAllBtn";
import AccessibilityBtn from "./AccessibilityBtn";

type MenuBtnProps = {
  onUploadPress: () => void;
  onSearchPress: () => void;
  onFilterPress: () => void;
  onSortAZ: () => void;
  onSortDate: () => void;
  onClearAll: () => void;
  onIncreaseTextSize: () => void;
  onEnableColorBlindFilter: () => void;
  isVisible: boolean;
};

export default function MenuBtn({
  onUploadPress,
  onSearchPress,
  onFilterPress,
  onSortAZ,
  onSortDate,
  onClearAll,
  onIncreaseTextSize,
  onEnableColorBlindFilter,
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
          <SortBtn
            onSortAZ={onSortAZ}
            onSortDate={onSortDate}
            style={{ bottom: 5, left: -19 }}
          />
          <UploadBtn onPress={onUploadPress} style={{ bottom: 60 }} />
          <ClearAllBtn onPress={onClearAll} style={{ bottom: 0, left: -110 }} />
          <AccessibilityBtn
            onIncreaseTextSize={onIncreaseTextSize}
            onEnableColorBlindFilter={onEnableColorBlindFilter}
            style={{ bottom: 260, left: -20 }}
          />
        </>
      )}
      <TouchableOpacity onPress={toggleMenu} activeOpacity={0.7}>
        <View
          style={[
            styles.menuButton,
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
