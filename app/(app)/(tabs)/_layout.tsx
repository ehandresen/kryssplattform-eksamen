import { Tabs, usePathname } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import Header from "../../../components/header/Header";
import { View, StyleSheet } from "react-native";

const TabsLayout = () => {
  const pathname = usePathname();

  const isGalleryScreen = pathname === "/gallery";
  const isArtistsScreen = pathname === "/artists";

  const subtitle = isGalleryScreen
    ? "Gallery"
    : isArtistsScreen
    ? "Artists"
    : "Exhibitions";

  return (
    <View style={styles.container}>
      {/* Header for Gallery, Artists, and Map screens */}
      <Header
        subtitle={subtitle}
        showLogoutButton={true} // Show Log out on the left
        showProfileButton={true} // Show Profile on the right
      />

      {/* Tab Navigation */}
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: { fontSize: 14 },
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "black",
          headerShown: false,
          tabBarHideOnKeyboard: true, // Keep the tab bar hidden when the keyboard is open
        }}
      >
        <Tabs.Screen
          name="gallery"
          options={{
            title: "Gallery",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="images" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="artists"
          options={{
            title: "Artists",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="users" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="exhibitions"
          options={{
            title: "Exhibitions",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="landmark" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fills the screen
  },
  tabBarStyle: {
    height: 80,
    position: "relative", // Allows tab bar to align at the bottom properly
    paddingTop: 5,
  },
});

export default TabsLayout;
