// app/(app)/(tabs)/_layout.tsx

import { Tabs, usePathname } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import Header from "../../../components/header/Header";

const TabsLayout = () => {
  const pathname = usePathname();

  const isGalleryScreen = pathname === "/gallery";
  const isArtistsScreen = pathname === "/artists";
  const isMapScreen = pathname === "/map";

  const subtitle = isGalleryScreen
    ? "Gallery"
    : isArtistsScreen
    ? "Artists"
    : "Map";

  return (
    <>
      {/* Header for Gallery, Artists, and Map screens */}
      <Header
        subtitle={subtitle}
        showLogoutButton={true} // Show Log out on the left
        showProfileButton={true} // Show Profile on the right
      />

      {/* Tab Navigation */}
      <Tabs
        screenOptions={{
          tabBarStyle: { height: 60 },
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 5 },
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
              <FontAwesome5 name="images" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="artists"
          options={{
            title: "Artists",
            tabBarIcon: ({ color }) => (
              <AntDesign name="team" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="map" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
