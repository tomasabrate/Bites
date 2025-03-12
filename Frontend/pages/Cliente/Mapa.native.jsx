import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import getComerciosForMaps from '../../services/comercios';

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
            {/* Muestra un indicador de carga si aún está cargando */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {/* Mapa con marcadores */}
                    <MapView
                        style={styles.mapNative}
                        initialRegion={{
                            latitude: origin.latitude,
                            longitude: origin.longitude,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.04,
                        }}
                    >
                        {comercios
                            .filter(comercio => comercio.lat && comercio.lon) // Filtrar comercios sin coordenadas
                            .map((comercio) => (
                                <Marker
                                    key={comercio.uid_comercio}
                                    coordinate={{
                                        latitude: Number(comercio.lat),
                                        longitude: Number(comercio.lon),
                                    }}
                                    title={comercio.nombre_comercio}
                                />
                            ))}
                    </MapView>

                    {/* Lista de comercios */}
                    <ScrollView style={styles.listContainer}>
                        {comercios.map((comercio) => (
                            <Text key={comercio.uid_comercio} style={styles.comercioText}>
                                {comercio.nombre_comercio}
                            </Text>
                        ))}
                    </ScrollView>
                </>
            )}

            {/* Mostrar error si hay un problema al cargar */}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    mapNative: { width: '100%', height: '70%' },
    listContainer: { marginTop: 10 },
    comercioText: { fontSize: 16, padding: 5 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default Mapa;
