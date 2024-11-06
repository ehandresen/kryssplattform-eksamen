// ProfileBtn.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ProfileBtn = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/profile");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <FontAwesome5 name="user-circle" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
});

export default ProfileBtn;
