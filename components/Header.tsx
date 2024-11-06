// Header.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "./Title";
import ProfileBtn from "./ProfileBtn";
import ReturnBtn from "./ReturnBtn";
import LogOutBtn from "./LogOutBtn";

type HeaderProps = {
  subtitle: string;
  showProfileButton?: boolean;
  showReturnButton?: boolean;
  showLogoutButton?: boolean;
};

const Header = ({
  subtitle,
  showProfileButton = false,
  showReturnButton = false,
  showLogoutButton = false,
}: HeaderProps) => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Left Button: Either Return or Log Out */}
        {showReturnButton && <ReturnBtn />}
        {showLogoutButton && !showReturnButton && <LogOutBtn />}

        {/* Title in the Center */}
        <Title subtitle={subtitle} />

        {/* Right Button: Profile or Log Out */}
        {showProfileButton && <ProfileBtn />}
        {showLogoutButton && showReturnButton && <LogOutBtn />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default Header;
