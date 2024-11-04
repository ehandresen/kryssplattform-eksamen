import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ArtworkCard = ({ title, artist, image }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
      {/* Replace with Image component if needed */}
      <View style={styles.imagePlaceholder}>
        <Text>Image Placeholder</Text>
      </View>
    </View>
  );
};

export default ArtworkCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // shadow
    width: 200,
    height: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
