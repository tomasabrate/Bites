import {  Text, StyleSheet, Pressable } from "react-native";

import React from "react";

export default function BotonGenerico({ title = "Boton", onPress, colorInicial = "#ff5226", colorPressed = "#ff8566"}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colorPressed : colorInicial },
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    padding: 12,
    flex: 1, // Para que los botones ocupen el mismo espacio
    marginHorizontal: 5,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
