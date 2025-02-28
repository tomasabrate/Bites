import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getResenas } from "../../services/resenas";
import { FontAwesome } from "@expo/vector-icons";
import { getNombreClienteByUid } from "../../services/clientes";

const ListaResenas = ({ onCrearResena, uid_comercio }) => {
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        cargarResenas();
    }, []);

    const cargarResenas = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const nuevasResenas = await getResenas(uid_comercio, page);

            if (nuevasResenas.length === 0) {
                setHasMore(false);
            } else {
                const resenasConNombres = await Promise.all(
                    nuevasResenas.map(async (resena) => {
                        const clienteData = await getNombreClienteByUid(resena.uid_cliente);
                        return {
                            ...resena,
                            nombre: clienteData?.nombre || "Desconocido",
                            apellido: clienteData?.apellido || "",
                        };
                    })
                );

                setResenas(prevResenas => [...prevResenas, ...resenasConNombres]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error("Error al obtener reseñas:", error);
        }

        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.resena}>
            <View style={styles.containerNombre}>
                <Text style={styles.usuario}>{item.nombre} </Text>
                <Text style={styles.usuario}>{item.apellido}</Text>
            </View>
            <Text style={styles.comentario}>{item.comentario}</Text>
            <Text style={styles.estrellas}>
                <FontAwesome name="star" size={16} color={'#c7b300'} /> {item.puntuacion}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={resenas}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={cargarResenas}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="small" color="#FF6347" /> : null}
            />

            <TouchableOpacity style={styles.buttonCrear} onPress={onCrearResena}>
                <Icon name="plus" size={20} color="white" />
                <Text style={styles.buttonTexto}>Crear Reseña</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    resena: {
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8
    },
    usuario: {
        fontWeight: "bold",
        fontSize: 16
    },
    comentario: {
        fontSize: 16,
        color: "#555"
    },
    estrellas: {
        fontSize: 14,
        color: "#c7b300",
        marginTop: 4
    },
    buttonCrear: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF6347",
        padding: 10,
        borderRadius: 8,
        justifyContent: "center",
        marginTop: 20
    },
    buttonTexto: {
        color: "white",
        fontSize: 16,
        marginLeft: 5
    },
    containerNombre: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default ListaResenas;
