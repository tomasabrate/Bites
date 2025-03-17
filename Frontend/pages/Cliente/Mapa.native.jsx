import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { getComerciosForMaps } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';

const Mapa = () => {
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
            setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerComercios();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <MapView
                        style={styles.mapNative}
                        initialRegion={{
                            latitude: origin.latitude,
                            longitude: origin.longitude,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {comercios
                            .filter(comercio => comercio.lat && comercio.lon)
                            .map((comercio) => (
                                <Marker
                                    key={comercio.uid_comercio}
                                    coordinate={{
                                        latitude: Number(comercio.lat),
                                        longitude: Number(comercio.lon),
                                    }}
                                    title={comercio.nombre_comercio}
                                    description={comercio.direccion}
                                    tracksViewChanges={false}
                                />
                            ))}
                    </MapView>
                </>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapNative: { width: '100%', height: '100%' },
    listContainer: { marginTop: 10 },
    comercioText: { fontSize: 16, padding: 5 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default Mapa;
