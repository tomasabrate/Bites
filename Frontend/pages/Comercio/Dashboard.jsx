import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import StatCard from './StatCard'; // Asegúrate de que la ruta sea correcta
import { BarChart } from 'react-native-chart-kit';

const Dashboard = ({ navigation }) => { // Asegúrate de que navigation se pase como prop
  const data = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [10, 20, 15, 25, 30, 22, 18],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Dashboard</Text>
      <View style={styles.statsContainer}>
        <StatCard title="Ventas Hoy" value="10">
          <Text style={styles.subStat}>Clientes Nuevos: 5</Text>
          <Text style={styles.subStat}>Clientes Habituales: 3</Text>
        </StatCard>
        <StatCard title="Productos Sin Stock" value="3" />
      </View>
      <Text style={styles.graphTitle}>Ventas de la Semana</Text>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fffbfb',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 99, 72, ${opacity})`,
          labelColor: () => '#333',
        }}
        style={styles.chart}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 10,
  },
  subStat: {
    color: '#fff',
    fontSize: 14,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  backButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 120,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Dashboard;
