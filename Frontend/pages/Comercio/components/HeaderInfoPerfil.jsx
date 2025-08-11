import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import BotonVolver from '../../../components/BotonVolver';
//import { getColors } from 'react-native-image-colors';
import EstrellaRating from './EstrellaRating';

const HeaderInfoPerfil = ({ comercio, onPressRating }) => {
    const [colorComercio, setColorComercio] = useState('#fff');

    /*useEffect(() => {
        const fetchImageColor = async () => {
            if (!comercio?.foto_perfil) return;

            const colors = await getColors(comercio.foto_perfil, {
                fallback: '#ffffff',
                cache: true,
            });

            if (colors.platform === 'android') {
                setColorComercio(colors.dominant);
            } else if (colors.platform === 'ios') {
                setColorComercio(colors.background);
            } else {
                setColorComercio(colors.dominant);
            }
        };

        fetchImageColor();
    }, [comercio?.foto_perfil]);

    */

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                <View style={{ position: 'absolute', top: 0, left: 0 }}>
                    <BotonVolver />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{comercio?.nombre_comercio || 'Nombre no disponible'}</Text>
                    <Text style={styles.subtitle}>{comercio?.direccion || 'Dirección no disponible'}</Text>
                    <TouchableOpacity onPress={onPressRating}>
                        <EstrellaRating rating={4} totalReviews={120} />
                    </TouchableOpacity>
                </View>
            </View>
            <Image source={comercio?.foto_perfil ? { uri: comercio?.foto_perfil } : require('../../../assets/user-default.png')} style={styles.imagePerfil} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#eaecee',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 1000,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 50,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
    },
    imagePerfil: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    content: {
        paddingTop: 80,
    },
});


export default HeaderInfoPerfil;