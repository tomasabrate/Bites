import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, Modal } from 'react-native';
import BotonGenerico from "../../components/BotonGenerico";
import { deleteCliente, getClienteById } from '../../services/clientes';
import { deleteComercio, getComercioById } from '../../services/comercios';

import firebaseApp from '../../firebase_config';
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

const DetalleUsuario = ({ navigation, route }) => {
    const user = route.params.user;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [textModal, setTextModal] = useState("")
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                let resultado = null;
                if (user.rol === 'Cliente') {
                    resultado = await getClienteById(user.id);
                    console.log("UID: ", user.id);
                    console.log(resultado);
                } else if (user.rol === 'Comercio') {
                    resultado = await getComercioById(user.id);
                }
                setData(resultado);
            } catch (err) {
                setError("Error al cargar usuario. Inténtalo de nuevo más tarde.");
            }
        };

        obtenerDatos();
    }, [user.id, user.rol]);

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={styles.title}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </SafeAreaView>
        );
    }

    const cerrarModal = () => {
        setModalVisible(false)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>Detalle Usuario</Text>

                    <View style={styles.card}>
                        <View style={styles.container}>
                            <Text style={styles.text}>UID: {user.id}</Text>
                            <Text style={styles.text}>Correo: {user.email}</Text>
                            <Text style={styles.text}>Rol: {user.rol}</Text>
                            {user.rol === 'Cliente' ? (
                                <View>
                                    <Text style={styles.text}>Nombre: {data.nombre}</Text>
                                    <Text style={styles.text}>Apellido: {data.apellido}</Text>
                                    <Text style={styles.text}>Fecha de nacimiento: {data.fecha_nacimiento}</Text>
                                    <Text style={styles.text}>Domicilio: {data.domicilio}</Text>
                                    <Text style={styles.text}>Telefono: {data.telefono}</Text>
                                </View>

                            ) : user.rol === 'Comercio' ? (
                                <View>
                                    <Text style={styles.text}>Nombre comermcio: {data.nombre_comercio}</Text>
                                    <Text style={styles.text}>Categoria: {data.id_categoria}</Text>
                                    <Text style={styles.text}>Descripcion: {data.descripcion}</Text>
                                    <Text style={styles.text}>Telefono: {data.telefono}</Text>
                                    <Text style={styles.text}>Horario de apertura: {data.horario_apertura}</Text>
                                    <Text style={styles.text}>Horario de cierre: {data.horario_cierre}</Text>
                                    <Text style={styles.text}>Zona de entrega: {data.zonas_entrega}</Text>
                                    <Text style={styles.text}>Costo de entrega: ${data.costo_entrega}</Text>
                                    <Text style={styles.text}>Metodos de pago: {data.metodos_pago}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <BotonGenerico
                    title="Volver"
                    onPress={() => navigation.goBack()}
                    colorInicial="#f44336"
                    colorPressed="#d32f2f"
                />
                <BotonGenerico
                    title="Modificar"
                    onPress={null}
                    colorInicial="#f44336"
                    colorPressed="#d32f2f"
                />
                <BotonGenerico
                    title="Dar de baja"
                    onPress={null}
                    colorInicial="#f44336"
                    colorPressed="#d32f2f"
                />
                <BotonGenerico
                    title="Eliminar"
                    onPress={() => {
                        setTextModal("¿Estas seguro que deseas eliminar este usuario?");
                        setModalVisible(true);
                    }}
                    colorInicial="#f44336"
                    colorPressed="#d32f2f"
                />
            </View>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={cerrarModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTexto}>{textModal}</Text>
                        <View style={styles.modalBotones}>
                            <BotonGenerico
                                title="Eliminar"
                                onPress={async () => {
                                    try {
                                        const docuRef = doc(firestore, `usuarios/${user.id}`);
                                        await deleteDoc(docuRef);

                                        if (user.rol === 'Cliente') {
                                            await deleteCliente(user.id);
                                        } else if (user.rol === 'Comercio') {
                                            await deleteComercio(user.id);
                                        } else {
                                            console.warn('Rol no reconocido');
                                        }

                                        cerrarModal();
                                        navigation.goBack();
                                    } catch (error) {
                                        console.error('Error al eliminar el usuario:', error);
                                    }
                                }}
                            />
                            <BotonGenerico
                                title="Cancelar"
                                onPress={cerrarModal}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#ffe8e3",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        gap: 8,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTexto: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    modalBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        flexWrap: 'nowrap',
        gap: 8,
    },
});


export default DetalleUsuario;