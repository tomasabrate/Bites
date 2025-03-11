import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './context/CartContext'; // Ruta correcta al CartContext
import { AuthProvider } from './context/AuthContext';
import TabNavigator from './navigation/TabNavigator';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

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
