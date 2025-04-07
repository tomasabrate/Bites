import React from 'react';
import {
    ScrollView,
    View
} from "react-native";

import Carrusel from "../../pages/Cliente/Carrusel";
import Productos from "../Productos/Productos";

const InicioCliente = () => {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <Carrusel />
            <Productos />
        </ScrollView>
    );
};

export default InicioCliente;