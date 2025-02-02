import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getClienteById } from "../../services/clientes";
import { useAuth } from "../../context/AuthContext";
import ItemPerfil from './components/ItemPerfil';
import { useFocusEffect } from '@react-navigation/native';
import BotonVolverSimple from '../../components/BotonVolverSimple';

const PerfilCliente = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    const [nombre, setNombre] = useState([]);
    const [apellido, setApellido] = useState([]);
    const [imgPerfil, setImgPerfil] = useState([]);
    const [email, setEmail] = useState([]);


    useFocusEffect(
        React.useCallback(() => {
            const obtenerUsuario = async () => {
                console.log(user)
                if (!user.uid) {
                    console.log("No se encuentra usuario");
                    return;
                }

                try {
                    let data;
                    data = await getClienteById(user.uid);

                    setNombre(data.nombre);
                    setApellido(data.apellido);
                    setImgPerfil(data.foto_perfil);
                    setEmail(data.email);

                } catch (error) {
                    console.log("No se pudo cargar al usuario:", error);
                }
            };

            obtenerUsuario();
        }, [])
    );

    return (
        <View style={styles.container}>
            <BotonVolverSimple/>
            <Image
                source={{ uri: imgPerfil }}
                style={styles.profileImage}
            />
            <Text style={styles.name}>{nombre} {apellido}</Text>
            <Text style={styles.bio}>{email}</Text>

            <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}>Perfil</Text>
            </View>
            <ItemPerfil
                title="Información personal"
                icon="user"
                onPress={() => navigation.navigate(null)}
            />
            <ItemPerfil
                title="Editar perfil"
                icon="edit"
                onPress={() => navigation.navigate('ModificarUsuario', { uid: user.uid, rol: "Cliente", admin: false })}
            />

            <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}>Actividad</Text>
            </View>
            <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}>Soporte</Text>
            </View>
            <ItemPerfil
                title="Terminos y condiciones"
                icon="info"
                onPress={() => navigation.navigate(null)}
            />
            <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}> </Text>
            </View>
            <ItemPerfil
                title="Cerrar sesión"
                icon="log-out"
                color={"red"}
                direccion={false}
                onPress={async () => {
                    try {
                        navigation.navigate('Login');
                        await logout();
                        console.log('Sesion cerrada');
                    } catch (error) {
                        console.error('No se pudo cerrar sesión:', error);
                    }
                }}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'top',
        backgroundColor: '#f5f5f5',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    sectionView: {
        alignItems: 'flex-start',
        width: '90%',
        paddingTop: 20,
    },
});

export default PerfilCliente;
