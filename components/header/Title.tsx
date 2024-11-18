// Title.tsx

// Importerer nødvendige moduler for å lage en tittelkomponent.
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Definerer typer for komponentens props
type TitleProps = {
  subtitle: string; // Obligatorisk undertekst som vises under hovedtittelen
};

/**
 * Title-komponent:
 * - Viser en hovedtittel ("ArtVista") og en undertekst som tilpasses dynamisk basert på prop-verdier.
 * @param subtitle Teksten som vises som undertekst.
 */
const Title = ({ subtitle }: TitleProps) => {
  return (
    <View style={styles.titleContainer}>
      {/* Hovedtittel */}
      <Text style={styles.title}>ArtVista</Text>

      {/* Undertekst */}
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

// Stiler for Title-komponenten
const styles = StyleSheet.create({
  titleContainer: {
    flex: 1, // Fyller tilgjengelig plass for å sentrere innholdet
    alignItems: "center", // Sentrerer tekst horisontalt
  },
  title: {
    fontSize: 20, // Størrelse på hovedtittel
    fontWeight: "bold", // Fet tekst for hovedtittel
  },
  subtitle: {
    fontSize: 12, // Mindre tekststørrelse for undertekst
    color: "#555", // Grå farge for å indikere sekundær betydning
  },
});

// Eksporterer komponenten som standard
export default Title;
