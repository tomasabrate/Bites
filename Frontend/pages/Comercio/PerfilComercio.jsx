import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getComercioAuth, getComercioById } from "../../services/comercios";
import { useAuth } from "../../context/AuthContext";
import ItemPerfil from '../../components/ItemPerfil';
import { useFocusEffect } from '@react-navigation/native';
//import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import ComercioTermsModal from '../TerminosyCond/TermComercio';
import ModalCerrarSesion from '../../components/ModalCerrarSesion';
import { openBrowserAsync } from 'expo-web-browser';
import { getAuthURL } from '../../services/mercadoPago';
import BotonVolverSimple from '../../components/BotonVolverSimple';

const PerfilClomercio = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    const [nombreComercio, setNombreComercio] = useState([]);
    const [imgPerfil, setImgPerfil] = useState(null);
    const [email, setEmail] = useState([]);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [modalCSVisible, setModalCSVisible] = useState(false);

    const autorizarMP = async () => {
        try {
            const comercioAuth = await getComercioAuth(user.uid);
            console.log(comercioAuth);
            if (comercioAuth.length === 0 || comercioAuth === null) {
                console.log("No se encuentra comercio");
                const authURL = await getAuthURL(user.uid);
                await openBrowserAsync(authURL);

                setTimeout(async () => {
                    const updatedComercioAuth = await getComercioAuth(user.uid);
                    Alert.alert("Credenciales actualizadas:", updatedComercioAuth);
                    console.log("Credenciales actualizadas:", updatedComercioAuth);
                }, 2000);
            } else {
                console.log("Su comercio ya esta autorizado para recibir pagos por MP");
                Alert.alert("Su comercio ya esta autorizado para recibir pagos por MP");
            }
        } catch (error) {
            console.log("ERROR al autorizar MP:", error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const obtenerUsuario = async () => {
                console.log(user)
                if (!user.uid) {
                    console.log("No se encuentra usuario");
                    return;
                }

                try {
                    let data = await getComercioById(user.uid);
                    setNombreComercio(data.nombre_comercio);
                    setImgPerfil(data.foto_perfil);
                    setEmail(data.mail);
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
                <BotonVolverSimple color={"white"} />
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.container}>

                <Image
                    source={
                        imgPerfil && typeof imgPerfil === "string"
                            ? { uri: imgPerfil }
                            : require('../../assets/user-default.png')
                    }
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{nombreComercio}</Text>
                <Text style={styles.bio}>{email}</Text>

                <View style={styles.sectionView}>
                    <Text style={styles.sectionTitle}>Perfil</Text>
                </View>
                <ItemPerfil
                    title="Información del comercio"
                    icon="shopping-bag"
                    onPress={() => navigation.navigate('InfoPerfilComercio', { uid_comercio: user.uid })}
                />
                <ItemPerfil
                    title="Editar información del perfil"
                    icon="edit"
                    onPress={() => navigation.navigate('ModificarUsuario', { uid: user.uid, rol: "Comercio", admin: false })}
                />

                <View style={styles.sectionView}>
                    <Text style={styles.sectionTitle}>Actividad</Text>
                </View>
                <ItemPerfil
                    title="Reportes"
                    icon="pie-chart"
                    onPress={() => navigation.navigate('Reportes')}
                />
                <ItemPerfil
                    title="Ventas"
                    icon="bookmark"
                    onPress={() => navigation.navigate('MisVentas')}
                />
                <View style={styles.sectionView}>
                    <Text style={styles.sectionTitle}>Soporte</Text>
                </View>
                <ItemPerfil
                    title="Configurar Mercado Pago"
                    icon="credit-card"
                    onPress={() => { autorizarMP() }}
                />
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
                    onPress={() => setModalCSVisible(true)}
                />
            </View>
            <ComercioTermsModal
                visible={showTermsModal}
                onClose={() => setShowTermsModal(false)}
            />

            <ModalCerrarSesion
                visible={modalCSVisible}
                onClose={() => setModalCSVisible(false)}
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
        //justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        paddingLeft: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#ff6347",
    },
    backButton: {
        marginRight: 16,
    },
});

export default PerfilClomercio;