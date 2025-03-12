import React, { useEffect } from 'react';
import {
    FlatList,
    View
} from "react-native";

import Carrusel from "../../pages/Cliente/Carrusel";
import Productos from "../Productos/Productos";


const InicioCliente = () => {
    const renderItem = ({ item }) => {
        if (item.type === 'carrusel') {
            return <Carrusel />;
        } else if (item.type === 'productos') {
            return <Productos />;
        }
        return null;
    };

    const data = [
        { type: 'carrusel' },
        { type: 'productos' }
    ];
    
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default InicioCliente;