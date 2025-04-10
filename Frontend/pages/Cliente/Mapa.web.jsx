import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getComerciosForMaps } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';
import L from 'leaflet';
import 'leaflet-color-markers';
import { useNavigation } from "@react-navigation/native";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

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

  const orangeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

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
                  icon={orangeIcon}
                >
                  <Popup>
                    <TouchableOpacity onPress={() => navigation.navigate("InfoPerfilComercio", { uid_comercio: comercio.uid_comercio })}>
                      <Text style={{ fontWeight: 'bold' }}>{comercio.nombre_comercio}</Text>
                    </TouchableOpacity>
                    <br />
                    <Text>{comercio.direccion}</Text>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapWeb: { width: '100%', height: '100%' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default Mapa;