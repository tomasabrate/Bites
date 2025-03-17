import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavigator from "./StackNavigator";
import { StatusBar, Platform, SafeAreaView } from "react-native";

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
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
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
