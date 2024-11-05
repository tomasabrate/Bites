import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

import firebaseApp from '../../firebase_config';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(firebaseApp);


const Login = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null); //'' probar
    const [password, setPassword] = useState(null);

    onAuthStateChanged(auth, (usuarioFirebase) => {
        if (usuarioFirebase){
            setUser(usuarioFirebase);
        }else{
            setUser(null);
        }
    })

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Cuenta creada')
                const user = userCredential.user;
                console.log(user)
            })
            .catch(error => { console.log(error) })
    };

    const handleSingIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Sesion iniciada')
                const user = userCredential.user;
                console.log(user)
            })
            .catch(error => { console.log(error) })
    };

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


                {/* Botón para Inicar Sesion*/}
                <TouchableOpacity
                    style={[styles.submitButton]}
                    onPress={handleSingIn}
                >
                    <Text style={styles.submitButtonText}>Iniciar Sesion</Text>
                </TouchableOpacity>

                {/* Botón para Crear Cuenta*/}
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
        width: '90%', // Asegúrate de que esto esté correcto
        marginTop: 20,
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
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    categoryButton: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        width: '45%',
        alignItems: 'center',
    },
    selectedCategory: {
        backgroundColor: '#ff6347',
    },
    categoryText: {
        color: '#333',
        fontSize: 16,
    },
    termsContainer: {
        marginVertical: 15,
        alignItems: 'center',
    },
    termsText: {
        color: '#007bff',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedCheckbox: {
        backgroundColor: '#4caf50', // Color cuando está seleccionado
    },
    checkboxText: {
        marginLeft: 5,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: 'lightgray',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Login;
