import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getResenas, postResena, getResenasByCliente } from "../../services/resenas";
import { FontAwesome } from "@expo/vector-icons";
import { getNombreClienteByUid } from "../../services/clientes";
import { useAuth } from '../../context/AuthContext';

const ListaResenas = ({ uid_comercio }) => {
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [agregandoResena, setAgregandoResena] = useState(false);
    const [nuevaResena, setNuevaResena] = useState("");
    const [estrellas, setEstrellas] = useState(0);
    const [resenaCliente, setResenaCliente] = useState(null);
    const [filtroEstrellas, setFiltroEstrellas] = useState(null);

    const currentPage = useRef(1);


    console.log("filtro estrellas:", filtroEstrellas);

    const { user } = useAuth();
    const uid_cliente = user.uid;

    useEffect(() => {
        cargarResenaCliente();
    }, []);

    useEffect(() => {
        setHasMore(true); // Restablece hasMore para permitir nuevas cargas
        setLoading(false); // Asegura que no se quede cargando
        cargarResenas(1, true); // Llama a cargarResenas con reset en true
    }, [filtroEstrellas]);



    const cargarResenaCliente = async () => {
        try {
            const resenaCliente = await getResenasByCliente(uid_comercio, uid_cliente);
            setResenaCliente(resenaCliente);
        } catch (error) {
            console.error("Error al obtener reseña del cliente:", error);
            setResenaCliente(null);
        }
    };


    const cargarResenas = useCallback(async (page = 1, reset = false) => {
        if (loading || (!hasMore && !reset)) return;
        setLoading(true);
    
        console.log("Cargando página:", page);
    
        try {
            const nuevasResenas = await getResenas(uid_comercio, uid_cliente, page, filtroEstrellas);
    
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
    
            if (reset) {
                setResenas(resenasConNombres);
                currentPage.current = 2; // Se reinicia el contador de páginas
                setHasMore(resenasConNombres.length > 0);
            } else {
                setResenas(prevResenas => [...prevResenas, ...resenasConNombres]);
    
                if (resenasConNombres.length > 0) {
                    currentPage.current++; // Solo se incrementa si hay nuevas reseñas
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error al obtener reseñas:", error);
        }
    
        setLoading(false);
    }, [uid_comercio, uid_cliente, filtroEstrellas]);
    


    const cambiarFiltroEstrellas = (num) => {
        setFiltroEstrellas(num === filtroEstrellas ? null : num); // Si ya está seleccionado, lo deselecciona
    };

    const onCrearResena = () => {
        setAgregandoResena(true);
    };

    const guardarResena = async () => {
        if (nuevaResena.trim() === "" || estrellas === 0) return;

        setLoading(true);

        const data = {
            uid_cliente: uid_cliente,
            uid_comercio: uid_comercio,
            puntuacion: estrellas,
            comentario: nuevaResena,
        };
        console.log("Datos antes de enviar:", data);

        try {
            await postResena(data);
            console.log("Reseña enviada con éxito");

            const nuevaResenaObj = {
                uid_cliente: uid_cliente,
                uid_comercio: uid_comercio,
                puntuacion: estrellas,
                comentario: nuevaResena,
            };

            setResenaCliente(nuevaResenaObj);
            setNuevaResena("");
            setEstrellas(0);
            setAgregandoResena(false);
        } catch (error) {
            console.error("Error al enviar reseña:", error);
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
        <View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                        key={num}
                        onPress={() => cambiarFiltroEstrellas(num)}
                        style={{
                            padding: 8,
                            margin: 5,
                            backgroundColor: filtroEstrellas === num ? "#c7b300" : "#ccc",
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ color: "white" }}>{num} ★</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.container}>
                {resenas.length === 0 && !loading && (
                    <Text style={{ textAlign: "center", marginVertical: 20, fontSize: 16, color: "#666" }}>
                        No hay reseñas disponibles.
                    </Text>
                )}


<FlatList
    data={resenas}
    renderItem={renderItem}
    keyExtractor={(item, index) => index.toString()}
    onEndReached={() => {
        if (!loading && hasMore) {
            cargarResenas(currentPage.current);
        }
    }}
    onEndReachedThreshold={0.5}
    ListFooterComponent={loading ? <ActivityIndicator size="small" color="#FF6347" /> : null}
/>




                {resenaCliente ? (
                    <View>
                        <Text style={styles.tituloResena}>Tu reseña</Text>
                        <View style={styles.resena}>
                            <Text style={styles.usuario}>Tú</Text>
                            <Text style={styles.comentario}>{resenaCliente.comentario}</Text>
                            <Text style={styles.estrellas}>
                                <FontAwesome name="star" size={16} color={'#c7b300'} /> {resenaCliente.puntuacion}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.mensajeInvitacion}>
                        Aún no has dejado una reseña. ¡Comparte tu experiencia!
                    </Text>
                )}

                {agregandoResena && (
                    <View style={{ marginTop: 20, padding: 10, backgroundColor: "#fff2f0", borderRadius: 10 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe tu reseña..."
                            value={nuevaResena}
                            onChangeText={setNuevaResena}
                        />
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <TouchableOpacity key={num} onPress={() => setEstrellas(num)} style={{ marginHorizontal: 5 }}>
                                    <Icon name="star" size={24} color={num <= estrellas ? "#c7b300" : "#ccc"} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={guardarResena} style={{ backgroundColor: "#FF6347", padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: "white", textAlign: "center" }}>Guardar Reseña</Text>
                        </TouchableOpacity>
                    </View>
                )}


                {!agregandoResena && (
                    <TouchableOpacity style={{ marginTop: 20, backgroundColor: "#FF6347", padding: 10, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={onCrearResena}>
                        <Icon name="plus" size={20} color="white" />
                        <Text style={{ color: "white", marginLeft: 10 }}>{resenaCliente ? "Modificar reseña" : "Añadir una reseña"}</Text>
                    </TouchableOpacity>

                )}
            </View>
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
    input: {
        height: 40,
        borderBottomWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        width: "100%",
    },
    mensajeInvitacion: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#666",
    },
    resenaUsuario: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#fff2f0",
        borderRadius: 10,
    },
    tituloResena: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#FF6347",
    },
});

export default ListaResenas;
