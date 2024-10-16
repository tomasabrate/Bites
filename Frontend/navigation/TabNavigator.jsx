import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Perfil from "../pages/Perfil";
import StackNavigator from "./StackNavigator";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "StackNavigator") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#ff6347" },
        headerStyle: { backgroundColor: "#ff6347" },
        headerTitleStyle: { fontWeight: "bold", color: "white" },
      })}
    >
      <Tab.Screen
        name="StackNavigator"
        component={StackNavigator}
        options={{ title: "Bites" }}
      />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}