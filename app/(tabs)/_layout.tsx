// app/(app)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Text } from "react-native";

const TabsLayout = () => (
  <Tabs>
    <Tabs.Screen
      name="gallery"
      options={{
        title: "Gallery",
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="images" size={24} color={color} />
        ),
        headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Gallery</Text>
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color }) => (
          <AntDesign name="user" size={24} color={color} />
        ),
        headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
        ),
      }}
    />
  </Tabs>
);

export default TabsLayout;
