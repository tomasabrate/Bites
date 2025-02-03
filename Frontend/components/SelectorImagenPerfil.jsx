import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

const SelectorImagenPerfil = ({ onImageSelected, initialImage }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (initialImage) {
            setImage(initialImage);
        }
    }, [initialImage]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar una imagen.');
            console.log('Permiso denegado');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            setImage(imageUri);
            onImageSelected?.(imageUri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                <Image
                    key={image}
                    source={image ? { uri: image } : require('../assets/user-default.png')}
                    style={styles.image}
                    onError={() => console.log("Error al cargar la imagen")}
                />
                <View style={styles.editIconContainer}>
                    <Feather name="edit-3" size={20} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: "white",
    },
    imageWrapper: {
        position: 'relative', 
    }, editIconContainer: {
        position: 'absolute',
        bottom: 5,  
        right: 5,
        backgroundColor: '#ddd', 
        borderRadius: 12,
        padding: 5,
    }
});

export default SelectorImagenPerfil;