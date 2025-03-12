import React, { useEffect } from 'react';
import {
    FlatList
} from "react-native";

import Carrusel from "../../pages/Cliente/Carrusel";
import MenuDesplegable from "../../pages/Cliente/MenuDesplegable";
import Productos from "../Productos/Productos"; 


const InicioCliente = () => {
    // Función para renderizar los componentes dentro del FlatList
    const renderItem = ({ item }) => {
        if (item.type === 'carrusel') {
            return <Carrusel />;
        } else if (item.type === 'productos') {
            return <Productos />;
        }
        return null;
    };

    // Datos para renderizar el FlatList
    const data = [
        { type: 'carrusel' },
        { type: 'productos' }
    ];

    // Utilizamos FlatList para manejar el scroll y ambos componentes
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

export default InicioCliente;