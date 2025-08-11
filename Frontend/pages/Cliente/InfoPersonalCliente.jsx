import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getClienteById } from "../../services/clientes";
//import { SafeAreaView } from "react-native-safe-area-context";
import BotonVolverSimple from "../../components/BotonVolverSimple";
import LoadingScreen from "../../components/LoadingScreen";

export default function InfoPersonalCliente() {
    const navigation = useNavigation();
    const route = useRoute();
    const { uid } = route.params;

    const [cliente, setCliente] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await getClienteById(uid);
                setCliente(data);
            } catch (error) {
                console.log("Error al cargar cliente:", error);
            }
        };
        fetchCliente();
    }, [uid]);

    if (!cliente) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <BotonVolverSimple color={"white"}/>
                <Text style={styles.headerTitle}>Información personal</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    source={
                        cliente.foto_perfil
                            ? { uri: Array.isArray(cliente.foto_perfil) ? cliente.foto_perfil[0] : cliente.foto_perfil }
                            : require("../../assets/user-default.png")
                    }
                    style={styles.profileImage}
                />

                <InfoItem label="Nombre" value={cliente.nombre} />
                <InfoItem label="Apellido" value={cliente.apellido} />
                <InfoItem label="Email" value={cliente.mail} />
                <InfoItem label="Fecha de nacimiento" value={cliente.fecha_nacimiento || "No registrada"} />
                <InfoItem label="Teléfono" value={cliente.telefono || "No registrado"} />
                <InfoItem label="Dirección" value={cliente.domicilio || "No registrada"} />
            </ScrollView>
        </SafeAreaView>
    );
}

function InfoItem({ label, value }) {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#ff6347",
    },
    header: {
        backgroundColor: "#ff6347",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        //justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        paddingLeft: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    infoItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    label: {
        fontSize: 14,
        color: "gray",
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
});
