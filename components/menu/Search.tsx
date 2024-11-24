/**
 * Generisk Search-komponent for filtrering av data basert på en søkestreng.
 * Kan brukes både for kunstverk og artister.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { searchByKey } from "@/utils/functions/search";

/**
 * Props for Search-komponenten
 * @param allData
 * @param setFilteredData
 * @param isSearchVisible
 * @param setIsSearchVisible
 * @param searchKey
 */
interface SearchProps<T> {
  allData: T[];
  setFilteredData: React.Dispatch<React.SetStateAction<T[]>>;
  isSearchVisible: boolean;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  searchKey: keyof T;
}

export default function Search<T>({
  allData,
  setFilteredData,
  isSearchVisible,
  setIsSearchVisible,
  searchKey,
}: SearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  // Effekt som filtrerer data når søkestrengen endres
  useEffect(() => {
    const filtered = searchQuery
      ? searchByKey(allData, searchQuery, searchKey as string)
      : allData;
    setFilteredData(filtered);
  }, [searchQuery, allData, setFilteredData, searchKey]);

  // Effekt som skjuler søkefeltet når tastaturet lukkes
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsSearchVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [setIsSearchVisible]);

  if (!isSearchVisible) return null;

  return (
    <View style={styles.searchContainer}>
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
  },
});
