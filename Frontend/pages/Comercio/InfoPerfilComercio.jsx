import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { getComercioById } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderInfoPerfil from './components/HeaderInfoPerfil';

const InfoPerfilComercio = ({ route }) => {
    const uid_comercio = route.params.uid_comercio;

    const [comercio, setComercio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalResenaVisible, setModalResenaVisible] = useState(false);

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

    const openCloseModal = () => {
        if (modalResenaVisible) {
            setModalResenaVisible(false);
        } else {
            setModalResenaVisible(true);
        };
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderInfoPerfil comercio={comercio} onPressRating={openCloseModal} />
            <Modal
                style={styles.modalContainer}
                transparent={true}
                animationType="slide"
                visible={modalResenaVisible}
                onRequestClose={openCloseModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Modal de reseñas</Text>
                        <TouchableOpacity onPress={openCloseModal}>
                            <Text>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
});


export default InfoPerfilComercio;
