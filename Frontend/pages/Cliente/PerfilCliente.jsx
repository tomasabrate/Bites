import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getClienteById } from "../../services/clientes";
import { useAuth } from "../../context/AuthContext";
import ItemPerfil from './components/ItemPerfil';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import ClientTermsModal from '../TerminosyCond/TermCliente';

const PerfilCliente = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    const [nombre, setNombre] = useState([]);
    const [apellido, setApellido] = useState([]);
    const [imgPerfil, setImgPerfil] = useState([]);
    const [email, setEmail] = useState([]);
    const [showTermsModal, setShowTermsModal] = useState(false);


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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                    <TouchableOpacity
                                onPress={() => navigation.navigate("InterfazCliente")}
                                style={styles.backButton}
                              >
                                <Icon name="arrow-left" size={24} color="white" />
                              </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mi Perfil</Text>
                </View>
            <View style={styles.container}>
                
                <Image
                    source={imgPerfil ? { uri: imgPerfil } : require('../../assets/user-default.png')}
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
                    onPress={() => setShowTermsModal(true)}
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
            <ClientTermsModal
          visible={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 30,
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
    header: {
        backgroundColor: "#ff6347",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#ff6347",
    },
    backButton: {
        marginRight: 16,
      },
});

export default PerfilCliente;
