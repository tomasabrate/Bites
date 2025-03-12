import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from "react-native-maps";

const Mapa = () => {
    const [origin, setOrigin] = useState({
        latitude: -31.42857647241912,
        longitude:  -64.18482463888431,
      });

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
