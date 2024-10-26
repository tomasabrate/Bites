import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ title, value, children }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {children && <View style={styles.subStats}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF6347',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subStats: {
    marginTop: 10,
  },
});

export default StatCard;
