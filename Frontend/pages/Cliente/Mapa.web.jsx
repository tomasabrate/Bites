import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getComerciosForMaps } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';
import L from 'leaflet';
import { useNavigation } from "@react-navigation/native";

const Mapa = () => {
  const navigation = useNavigation();

  const [origin] = useState({
    latitude: -31.42857647241912,
    longitude: -64.18482463888431,
  });

  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerComercios = async () => {
    try {
      const data = await getComerciosForMaps();
      if (data.length > 0 && data.length !== comercios.length) {
        setComercios(data);
      }
    } catch (error) {
      setError("Error al obtener los comercios para el mapa. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerComercios();
  }, []);

  const createCustomIcon = (nombre) => {
    const inicial = nombre ? nombre.charAt(0).toUpperCase() : 'B';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: #ff6347;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-family: sans-serif;
        font-size: 16px;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        ${inicial}
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
      tooltipAnchor: [0, -18],
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <MapContainer
            center={[origin.latitude, origin.longitude]}
            zoom={13}
            style={styles.mapWeb}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {comercios
              .filter(comercio => comercio.lat && comercio.lon)
              .map((comercio) => (
                <Marker
                  key={comercio.uid_comercio}
                  position={[Number(comercio.lat), Number(comercio.lon)]}
                  icon={createCustomIcon(comercio.nombre_comercio)}
                >
                  <Popup>
                    <View style={{ alignItems: 'center', padding: 4 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 2, textAlign: 'center' }}>
                        {comercio.nombre_comercio}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#666', marginBottom: 10, textAlign: 'center' }}>
                        {comercio.direccion}
                      </Text>
                      <TouchableOpacity 
                        style={{ backgroundColor: '#ff6347', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 5, alignItems: 'center' }}
                        onPress={() => navigation.navigate("InfoPerfilComercio", { uid_comercio: comercio.uid_comercio })}
                      >
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>Ver local</Text>
                      </TouchableOpacity>
                    </View>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
          {error && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapWeb: { width: '100%', height: '100%', zIndex: 0 },
  errorOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  errorText: { color: 'red', textAlign: 'center', fontWeight: 'bold' },
});

export default Mapa;