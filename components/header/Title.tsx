// Title.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type TitleProps = {
  subtitle: string;
};

const Title = ({ subtitle }: TitleProps) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>ArtVista</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
  },
});

export default Title;
