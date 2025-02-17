import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { Feather } from '@expo/vector-icons';

export default function BotonVolver({color}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name='chevron-left' size={40} color={color ? color : 'black'} />
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