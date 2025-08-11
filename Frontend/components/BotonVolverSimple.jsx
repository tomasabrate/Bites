import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { Feather } from '@expo/vector-icons';

export default function BotonVolver({color}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={color ? color : 'white'} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',  // Posicionamiento absoluto
        top: 10,               // Distancia desde la parte superior
        left: 10,              // Distancia desde la izquierda
        padding: 10,           // Aumenta el área táctil
        elevation: 2,
    },
});