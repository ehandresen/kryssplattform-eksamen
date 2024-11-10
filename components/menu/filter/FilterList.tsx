// FilterList.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

type FilterListProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (filter: string) => void;
  hashtags: string[];
};

const FilterList = ({
  visible,
  onClose,
  onSelect,
  hashtags,
}: FilterListProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.listContainer}>
          <Text style={styles.title}>Select a Hashtag</Text>

          {/* Hashtags List */}
          <ScrollView style={styles.scrollView}>
            {hashtags.map((hashtag) => (
              <TouchableOpacity
                key={hashtag}
                onPress={() => onSelect(hashtag)}
                style={styles.hashtagButton}
              >
                <Text style={styles.hashtagText}>#{hashtag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Close/Cancel Button */}
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
    backgroundColor: "#d19898", // Same color as UploadForm background
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
    maxHeight: 200, // Limit height for scrolling
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
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FilterList;
