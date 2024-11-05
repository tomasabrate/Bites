import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './context/CartContext'; // Ruta correcta al CartContext
import { AuthProvider } from './context/AuthContext';
import TabNavigator from './navigation/TabNavigator';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
