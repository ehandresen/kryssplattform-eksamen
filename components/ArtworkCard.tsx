import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

type ArtworkCardProps = {
  title: string;
  artist: string;
  imageUrl: string;
  caption: string;
  viewsCount: number;
  likesCount: number;
};

const ArtworkCard = ({
  title,
  artist,
  imageUrl,
  caption,
  viewsCount,
  likesCount,
}: ArtworkCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
      <Text style={styles.caption}>{caption}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stats}>Views: {viewsCount}</Text>
        <Text style={styles.stats}>Likes: {likesCount}</Text>
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
    elevation: 2,
    width: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  artist: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  image: {
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ddd',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats: {
    fontSize: 12,
    color: '#555',
  },
});
