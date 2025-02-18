import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getComercioById } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';
import BotonVolverSimple from '../../components/BotonVolverSimple';
import { SafeAreaView } from "react-native-safe-area-context";

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
            <View style={styles.container1}>
            <BotonVolverSimple />
            <Text style={styles.title}>{comercio.nombre_comercio}</Text>
            </View>
            <Text style={styles.subtitle}>{comercio?.direccion || 'Dirección no disponible'}</Text>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20, 
    },
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#fff' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    subtitle: { 
        fontSize: 16, 
        color: 'gray',
        marginLeft: 43 
    },
    buttonContainer: { 
        flexDirection: 'row', 
        marginVertical: 10 
    },
    button: { 
        flex: 1, 
        padding: 10, 
        backgroundColor: 
        'lightgray', 
        alignItems: 'center', 
        borderRadius: 5 
    },
    container1: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default InfoPerfilComercio;
