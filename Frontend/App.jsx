import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import TabNavigator from './navigation/TabNavigator';
import { StatusBar, Linking } from 'react-native';
import { useDeepLinks } from './hooks/useDeepLinks';
import { Buffer } from 'buffer';
global.Buffer = Buffer;


export default function App() {
  const navigationRef = useRef(null);

  // Usar el hook para manejo de deep links
  const { createDeepLink, prefix } = useDeepLinks(navigationRef);

  console.log('Prefijo de deep link:', prefix); // Útil para depuración
  console.log('URL para éxito:', createDeepLink('payment/success'));
  console.log('URL para fallo:', createDeepLink('payment/failure'));
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <TabNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
