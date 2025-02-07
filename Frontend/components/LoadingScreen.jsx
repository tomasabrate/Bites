import React from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
    return (
        <SafeAreaView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6347" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default LoadingScreen;