import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SelectList } from "react-native-dropdown-select-list";

import firebaseApp from '../../firebase_config';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const Login = ({ navigation }) => {
    const [loading, setLoading] = useState(true); // Estado de carga
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const tipo = [
        { value: "Cliente" },
        { value: "Comercio" },
    ];

    useEffect(() => {
        // Temporizador de carga de 1 segundo
        const timer = setTimeout(() => {
            setLoading(false); // Cambia el estado después de 1 segundo
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const getRol = async (uid) => {
        try {
            const docuRef = doc(firestore, `usuarios/${uid}`);
            const docuCifrada = await getDoc(docuRef);
    
            if (docuCifrada.exists()) {
                return docuCifrada.data().rol;
            } else {
                console.warn("Documento no encontrado para el usuario:", uid);
                return null;
            }
        } catch (error) {
            console.error("Error al obtener rol:", error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
            if (userCredential) {
                const rol = await getRol(userCredential.uid);
                
                if (rol) { // Solo continúa si `rol` no es nulo
                    const userData = {
                        uid: userCredential.uid,
                        email: userCredential.email,
                        rol: rol,
                    };
                    setUser(userData);
                    console.log("Info Usuario Final: ", userData);
    
                    // Redirige basado en el rol del usuario
                    if (userData.rol === 'Admin') {
                        navigation.navigate('LoginSelection');
                    } else if (userData.rol === 'Cliente') {
                        navigation.navigate('InterfazCliente');
                    } else if (userData.rol === 'Comercio') {
                        navigation.navigate('InterfazComerciante');
                    }
                } else {
                    console.warn("El rol no está definido para el usuario.");
                }
            } else {
                setUser(null);
            }
        });
    
        return () => unsubscribe();
    }, [isAuthenticated]);

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log('Cuenta creada');
                const docuRef = doc(firestore, `usuarios/${userCredential.user.uid}`);
                await setDoc(docuRef, { email: email, rol: rol }); // guarda el mail y rol
            })
            .catch(error => { console.log(error) });
    };

    const handleSingIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Sesion iniciada');
                setIsAuthenticated(true); // cambia el estado para indicar que el usuario se autentico
            })
            .catch(error => { console.log(error) });
    };

    if (loading) {
        // Pantalla de carga
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6347" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Inicio de Sesion</Text>

                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="correo@dominio.com"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Cuenta</Text>
                <SelectList
                    setSelected={setRol}
                    label="Tipo"
                    data={tipo}
                    styles={styles.picker}
                    save="value"
                />

                <TouchableOpacity
                    style={[styles.submitButton]}
                    onPress={handleSingIn}
                >
                    <Text style={styles.submitButtonText}>Iniciar Sesion</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton]}
                    onPress={handleCreateAccount}
                >
                    <Text style={styles.submitButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe8e3',
    },
    container: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe8e3', // Fondo mientras carga
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    picker: {
        height: 50,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        marginTop: 20,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Login;
