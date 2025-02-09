import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import useLogout from "../../utils/logout";

import firebaseApp from "../../firebase_config";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const firestore = getFirestore(firebaseApp);

const RegistroGoogle = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userInfo } = route.params;

    const handleLogout = useLogout();

    const [rol, setRol] = useState(false);

    const handleCreateAccount = async (userInfo) => {
        try {
            const docuRef = doc(firestore, `usuarios/${userInfo.uid}`);
            await setDoc(docuRef, {
                email: userInfo.email,
                rol: rol,
                perfilCompleto: false,
                activo: true,
            });

            console.log("Documento de usuario creado en Firestore");

            if (rol === 'Cliente') {
                navigation.navigate('RegistroCliente');
            } else if (rol === 'Comercio') {
                navigation.navigate('RegistroComercio');
            }
        } catch (error) {
            console.error("Error al crear cuenta en Firestore:", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Para continuar, elija uno de los siguientes roles: </Text>
                <Text style={styles.title}>Cliente: Si deseas comprar productos o servicios.</Text>
                <Text style={styles.title}>Comercio: Si eres un vendedor y quieres ofrecer productos o servicios.</Text>
                <View style={styles.options}>
                    <TouchableOpacity style={[styles.option, rol === "Comercio" && styles.selected]} onPress={() => setRol("Cliente")}>
                        <Text style={[styles.submitButtonText, rol === "Cliente" && styles.textSelected]}>Cliente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.option, rol === "Cliente" && styles.selected]} onPress={() => setRol("Comercio")}>
                        <Text style={[styles.submitButtonText, rol === "Comercio" && styles.textSelected]}>Comercio</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[styles.submitButton, rol ? {} : styles.disabledButton]}
                    onPress={() => handleCreateAccount(userInfo)}
                    disabled={!rol}
                >
                    <Text style={styles.submitButtonText}>Continuar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cancelButton]} onPress={handleLogout}>
                    <Text style={styles.submitButtonText}>Cancelar y cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffe8e3",
    },
    container: {
        padding: 20,
        backgroundColor: "white",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        marginTop: 20,
        maxWidth: 500,
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
    options:
    {
        flexDirection: 'row',
        justifyContent: "center",
        padding: 16,
        gap: 10,
    },
    option: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 5,
        marginTop: 5,
        backgroundColor: '#ff6347',
        borderColor: '#ff6347',
        paddingVertical: 15
    },
    selected: { backgroundColor: '#ccc', borderColor: '#ccc' },
    textSelected: {
        fontSize: 18,
        color: 'white',
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    cancelButton: {
        backgroundColor: "#c82424",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        fontSize: 18,
        textAlign: "center",
        color: "#333",
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: "#ff6347",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
      },
});

export default RegistroGoogle;