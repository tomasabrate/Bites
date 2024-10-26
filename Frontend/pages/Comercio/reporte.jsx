import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de tener esta dependencia

const Reportes = ({ navigation }) => {
  const [data] = useState({
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [
      {
        data: [50, 45, 60],
      },
    ],
  });

  const totalIngresos = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const promedioIngresos = totalIngresos / data.datasets[0].data.length;

  const handleBarPress = (dataPoint) => {
    const index = dataPoint.index;
    Alert.alert(
      `Detalles de ${data.labels[index]}`,
      `El ingreso en ${data.labels[index]} fue $${data.datasets[0].data[index]}`
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}> Volver</Text>
      </TouchableOpacity>
      
      <Text style={styles.titulo}>Reportes</Text>
      <Text style={styles.descripcion}>
        Aquí puedes ver el total de ingresos por mes. 
        Toca una barra para obtener más detalles.
      </Text>
      <View style={styles.resumen}>
        <Text style={styles.resumenText}>
          <Icon name="attach-money" size={20} color="#FF6347" /> 
          Total: ${totalIngresos}
        </Text>
        <Text style={styles.resumenText}>
          <Icon name="info-outline" size={20} color="#FF6347" />
          Promedio: ${promedioIngresos.toFixed(2)}
        </Text>
      </View>
      <BarChart
        data={data}
        width={320}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fffbfb',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 99, 72, ${opacity})`,
          labelColor: () => '#333',
        }}
        style={styles.chart}
        onDataPointClick={({ value, getColor, index }) => handleBarPress({ index, value, getColor })}
      />
      <Button title="Filtrar por Mes" onPress={() => { /* Lógica de filtrado aquí */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: 120,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  resumen: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resumenText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Reportes;
