import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

export default function MapaTest() {
  const region = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude: -34.6037, longitude: -58.3816 }}>
          <Callout>
            <View style={styles.calloutView}>
              <Text >Comercio Test</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  calloutView: {
    width: 150,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  calloutImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
