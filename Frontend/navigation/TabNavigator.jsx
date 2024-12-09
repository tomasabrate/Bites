import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavigator from "./StackNavigator";
import { StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={() => ({
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: { display: 'none' },
      headerStyle: { backgroundColor: "#ff6347" },
      headerTitleStyle: { fontWeight: "bold", color: "white" },
      headerShown: false
    })}
  >
    <Tab.Screen
      name="StackNavigator"
      component={() => (
        <SafeAreaView
          style={{
            backgroundColor: "black",
            flex: 1,
            paddingTop: Platform.OS === 'android'
              ? StatusBar.currentHeight
              : Platform.OS === 'ios'
              ? 0 // iOS ya maneja automáticamente SafeAreaView
              : 1, // Para web, agrega un espacio fijo (con 1 no se nota, pero agrega una franja arriba)
          }}
        >
          <StackNavigator />
        </SafeAreaView>
      )}
      options={{ title: "Bites" }}
    />
  </Tab.Navigator>
  );
}
