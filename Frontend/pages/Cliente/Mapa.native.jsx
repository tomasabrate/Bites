import React, { useState, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import getComerciosForMaps from '../../services/comercios';

const Mapa = () => {
    const [origin, setOrigin] = useState({
        latitude: -31.42857647241912,
        longitude: -64.18482463888431,
    });

    const [comercios, setComercios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const obtenerComercios = async () => {
        try {
            const data = await getComerciosForMaps();
            setComercios(data);
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
            <MapView style={styles.mapNative}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapNative: { width: '100%', height: '100%' },
});

export default Mapa;
