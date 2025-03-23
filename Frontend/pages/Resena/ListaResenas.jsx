import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getResenas } from "../../services/resenas";
import { FontAwesome } from "@expo/vector-icons";
import { getNombreClienteByUid } from "../../services/clientes";
import { useAuth } from '../../context/AuthContext';
import { postResena } from "../../services/resenas";

const ListaResenas = ({ uid_comercio }) => {
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [agregandoResena, setAgregandoResena] = useState(false);
    const [nuevaResena, setNuevaResena] = useState("");
    const [estrellas, setEstrellas] = useState(0);

    const { user } = useAuth();

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

    const onCrearResena = () => {
        setAgregandoResena(true);
    };

    const guardarResena = async () => {
        if (nuevaResena.trim() === "" || estrellas === 0) return;

        setLoading(true);

        const data = {
            uid_cliente: user.uid,
            uid_comercio: uid_comercio,
            puntuacion: estrellas,
            comentario: nuevaResena,
        };
        console.log("Datos antes de enviar:", data);

        try {

            await postResena(data);
            console.log("✅ Reseña enviada con éxito");

            const nuevaResenaObj = {
                uid_cliente,
                uid_comercio,
                puntuacion: estrellas,
                comentario: nuevaResena,
                nombre: "Tú",
                apellido: ""
            };

            setResenas(prevResenas => [nuevaResenaObj, ...prevResenas]);
            setNuevaResena("");
            setEstrellas(0);
            setAgregandoResena(false);
        } catch (error) {
            console.error("❌ Error al enviar reseña:", error);
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
            {resenas.length === 0 && !loading && (
                <Text style={{ textAlign: "center", marginVertical: 20, fontSize: 16, color: "#666" }}>
                    No hay reseñas disponibles.
                </Text>
            )}

            <FlatList
                data={resenas}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={cargarResenas}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="small" color="#FF6347" /> : null}
            />

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

            <TouchableOpacity style={{ marginTop: 20, backgroundColor: "#FF6347", padding: 10, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={onCrearResena}>
                <Icon name="plus" size={20} color="white" />
                <Text style={{ color: "white", marginLeft: 10 }}>Añadir una reseña</Text>
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
    input: {
        height: 40,
        borderBottomWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        width: "100%",
      },
});

export default ListaResenas;
