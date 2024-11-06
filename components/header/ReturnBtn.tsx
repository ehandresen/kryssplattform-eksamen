// ReturnBtn.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const ReturnBtn = () => {
  const router = useRouter();

  const handlePress = () => {
    router.back();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <AntDesign name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
});

export default ReturnBtn;
