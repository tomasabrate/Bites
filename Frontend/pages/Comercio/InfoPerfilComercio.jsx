import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getComercioById } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderInfoPerfil from './components/HeaderInfoPerfil';

const InfoPerfilComercio = ({ route }) => {
    const uid_comercio = route.params.uid_comercio;

    const [comercio, setComercio] = useState(null);
    const [loading, setLoading] = useState(true);

    const obtenerComercio = async () => {
        try {
            console.log(uid_comercio);
            const data = await getComercioById(uid_comercio);
            console.log(data);
            setComercio(data);
        } catch (error) {
            console.log("Error al obtener comercio");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerComercio();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderInfoPerfil comercio={comercio} />

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    container1: {
        flexDirection: "row",
        alignItems: "center",
    },
});


export default InfoPerfilComercio;
