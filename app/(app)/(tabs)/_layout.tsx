/**
 * Hovedlayout for appen som håndterer navigasjon mellom Gallery, Artists og Exhibitions.
 * Inkluderer en dynamisk Header og Tab-navigasjon med ikoner for hver skjerm.
 */

import { Tabs, usePathname } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import Header from "../../../components/header/Header";
import { View, Text } from "react-native";
import { Colors } from "@/constants/colors";

const TabsLayout = () => {
  try {
    const pathname = usePathname();

    const isGalleryScreen = pathname === "/gallery";
    const isArtistsScreen = pathname === "/artists";

    const subtitle = isGalleryScreen
      ? "Gallery"
      : isArtistsScreen
      ? "Artists"
      : "Exhibitions";

    return (
      <View className="flex-1">
        {/* Header som vises øverst */}
        <Header
          subtitle={subtitle}
          showLogoutButton={true}
          showProfileButton={true}
        />

        {/* Tab-navigasjon mellom skjermene */}
        <Tabs
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14 },
            tabBarActiveTintColor: "red",
            tabBarInactiveTintColor: "black",
            headerShown: false,
            tabBarHideOnKeyboard: true,
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
  } catch (error) {
    // Feilhåndtering for TabsLayout
    if (error instanceof Error) {
      console.error("Error in TabsLayout:", error.message);
    } else {
      console.error("Unknown error in TabsLayout:", error);
    }
    return (
      <View style={{ flex: 1, backgroundColor: Colors.normal.background }}>
        <Header
          subtitle="Error"
          showLogoutButton={false}
          showProfileButton={false}
        />
        <View className="mt-20">
          <Text className="text-red-600 text-lg text-center">
            An error occured in navigation. try again later.
          </Text>
        </View>
      </View>
    );
  }
};

export default TabsLayout;
