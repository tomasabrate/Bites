import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsAuthenticated(true); // Simular autenticación
    };

    checkAuthentication();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}
