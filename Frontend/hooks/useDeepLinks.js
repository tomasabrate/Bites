// hooks/useDeepLinks.js
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

/**
 * Hook para manejar deep links específicos de Mercado Pago
 * @param {Object} navigationRef - Referencia al navegador
 */
export function useDeepLinks(navigationRef) {
  // Obtener el prefijo de la URL (esquema de la app)
  const prefix = Linking.createURL('/');

  const handleDeepLink = (url) => {
    if (!url) return;

    console.log('Deep link recibido:', url);

    try {
      // Parsear la URL con expo-linking
      const { path, queryParams } = Linking.parse(url);
      console.log('Ruta:', path, 'Parámetros:', queryParams);

      // Dividir la ruta en segmentos
      const segments = path.split('/').filter(Boolean); // filter(Boolean) elimina strings vacíos

      // Redirigir todas las rutas de payment a ComprobandoPago
      if (segments[0] === 'payment') {
        // Añadir el status como parámetro para que ComprobandoPago sepa qué tipo de pago es
        const params = {
          ...queryParams,
          status: segments[1] || 'unknown' // success, failure, pending o unknown
        };

        console.log('Navegando a ComprobandoPago con params:', params);
        navigationRef.current?.navigate('ComprobandoPago', params);
      }
    } catch (error) {
      console.error('Error al procesar deep link:', error);
    }
  };

  useEffect(() => {
    // Configurar el manejador de deep links
    const setupDeepLinks = async () => {
      // Manejar deep links cuando la app está cerrada
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        console.log('URL inicial:', initialURL);
        handleDeepLink(initialURL);
      }

      // Manejar deep links cuando la app está abierta
      Linking.addEventListener('url', (event) => {
        handleDeepLink(event.url);
      });
    };

    setupDeepLinks();

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      // En versiones recientes de expo-linking, no es necesario eliminar el listener
      // ya que se maneja automáticamente
    };
  }, []);

  // Función para crear deep links
  const createDeepLink = (path, params = {}) => {
    return Linking.createURL(path, { queryParams: params });
  };

  return {
    handleDeepLink,
    createDeepLink,
    prefix
  };
}