import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Perfil from '../screens/Perfil'; // Pantalla de perfil
import AppNavigator from './AppNavigator'; // Mantén esta referencia para el flujo

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#ff6347' },
        headerStyle: { backgroundColor: '#ff6347' },
        headerTitleStyle: { fontWeight: 'bold', color: 'white' },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={AppNavigator} // Asegúrate de que esta referencia sea correcta
        options={{ title: 'Bites' }}
      />
      <Tab.Screen name="Perfil" component={Perfil} options={{ title: 'Mi Perfil' }} />
    </Tab.Navigator>
  );
}
