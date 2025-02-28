import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { getComercioById } from '../../services/comercios';
import LoadingScreen from '../../components/LoadingScreen';
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderInfoPerfil from './components/HeaderInfoPerfil';
import { getProductosByUidComercio } from '../../services/productos';
import Producto from '../Productos/components/Producto';
import { useNavigation } from "@react-navigation/native";
import ListaResenas from '../Resena/ListaResenas';
import { FontAwesome } from "@expo/vector-icons";

const InfoPerfilComercio = ({ route }) => {
    const navigation = useNavigation();
    const uid_comercio = route.params.uid_comercio;

    const [comercio, setComercio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [modalResenaVisible, setModalResenaVisible] = useState(false);
    const [error, setError] = useState(false);
    const [productos, setProductos] = useState(false);

    const obtenerComercio = async () => {
        try {
            console.log(uid_comercio);
            const data = await getComercioById(uid_comercio);
            console.log(data);
            setComercio(data);
        } catch (error) {
            setError("Error al obtener comercio. Inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const obtenerProductos = async () => {
        try {
            const data = await getProductosByUidComercio(uid_comercio);
            setProductos(data);
        } catch (error) {
            setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
        } finally {
            setLoadingProductos(false);
        }
    };

    useEffect(() => {
        obtenerComercio();
        obtenerProductos();
    }, []);


    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (<Text>{error}</Text>);
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
            {loadingProductos ? (
                <LoadingScreen />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    style={styles.flatList}
                    data={productos}
                    keyExtractor={(item) => item.id_producto.toString()}
                    renderItem={({ item }) => (
                        <Producto
                            imagenes={item.imagenes}
                            id_producto={item.id_producto}
                            nombre={item.nombre}
                            precio={item.precio}
                            descuento={item.descuento}
                            nombre_comercio={item.nombre_comercio}
                            foto_perfil={item.foto_perfil}
                            uid_comercio={item.uid_comercio}
                            onPress={() =>
                                navigation.navigate("DetalleProducto", { producto: item })
                            }
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <Modal
                style={styles.modalContainer}
                transparent={true}
                animationType="slide"
                visible={modalResenaVisible}
                onRequestClose={openCloseModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.cerrarModal}>
                            <TouchableOpacity onPress={openCloseModal}>
                                <FontAwesome name="close" size={20} color={'black'} />
                            </TouchableOpacity>
                        </View>
                        <ListaResenas onCrearResena={() => console.log("Abrir modal para crear reseña")} uid_comercio={uid_comercio} />
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
    flatList: {
        width: "100%",
        marginTop: 100
    },
    cerrarModal: {
        alignSelf: "flex-end",
        padding: 10,
    }
});


export default InfoPerfilComercio;
