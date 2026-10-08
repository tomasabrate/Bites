import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from '@react-navigation/native';
import React from "react";

export default function BotonVolver() {
    const navigation = useNavigation();

    return (
        <View style={styles.bannerOverlay}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={20} color="#333333" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bannerOverlay: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f0f0f0"
    },
});