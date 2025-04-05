// hooks/useDeepLinks.js
import { useEffect, useCallback, useRef } from 'react';
import * as Linking from 'expo-linking';

/**
 * Hook para manejar deep links específicos de Mercado Pago
 * @param {Object} navigationRef - Referencia al navegador
 */
export function useDeepLinks(navigationRef) {
  // Referencia para evitar procesar la misma URL múltiples veces
  const lastProcessedUrl = useRef(null);
  
  // Obtener el prefijo de la URL (esquema de la app)
  const prefix = Linking.createURL('/');
  
  // Usar useCallback para evitar recrear la función en cada renderizado
  const handleDeepLink = useCallback((url) => {
    if (!url) return;
    
    // Evitar procesar la misma URL múltiples veces
    if (url === lastProcessedUrl.current) return;
    lastProcessedUrl.current = url;
    
    // Ignorar URLs del servidor de desarrollo
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      console.log('Ignorando URL del servidor de desarrollo:', url);
      return;
    }
    
    console.log('Deep link recibido:', url);

    try {
      // Parsear la URL con expo-linking
      const { path, queryParams } = Linking.parse(url);
      console.log('Ruta:', path, 'Parámetros:', queryParams);
      
      // Si no hay ruta, no es un deep link válido
      if (!path) return;
      
      // Dividir la ruta en segmentos
      const segments = path.split('/').filter(Boolean);
      
      // Redirigir todas las rutas de payment a ComprobandoPago
      if (segments[0] === 'payment') {
        // Añadir el status como parámetro para que ComprobandoPago sepa qué tipo de pago es
        const params = {
          ...queryParams,
          status: segments[1] || 'unknown'
        };

        console.log('Navegando a ComprobandoPago con params:', params);
        if (navigationRef.current) {
          navigationRef.current.navigate('ComprobandoPago', params);
        }
      }
    } catch (error) {
      console.error('Error al procesar deep link:', error);
    }
  }, [navigationRef]);

  useEffect(() => {
    let subscription = null;
    
    // Configurar el manejador de deep links
    const setupDeepLinks = async () => {
      try {
        // Manejar deep links cuando la app está cerrada
        const initialURL = await Linking.getInitialURL();
        if (initialURL && !initialURL.includes('localhost') && !initialURL.includes('127.0.0.1')) {
          console.log('URL inicial:', initialURL);
          handleDeepLink(initialURL);
        }
        
        // Manejar deep links cuando la app está abierta
        subscription = Linking.addEventListener('url', (event) => {
          handleDeepLink(event.url);
        });
      } catch (error) {
        console.error('Error al configurar deep links:', error);
      }
    };

    setupDeepLinks();

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [handleDeepLink]);

  // Función para crear deep links (memoizada para evitar recreaciones)
  const createDeepLink = useCallback((path, params = {}) => {
    return Linking.createURL(path, { queryParams: params });
  }, []);

  return {
    handleDeepLink,
    createDeepLink,
    prefix
  };
}