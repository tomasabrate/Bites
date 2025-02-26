import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Group, Bar, Pie } from '@visx/shape';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GradientOrangeRed } from '@visx/gradient';
import { Legend } from '@visx/legend';
import Svg, { G, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

import ExportarExcelButton from '../../components/ExportarExcelButton';

const { width: screenWidth } = Dimensions.get('window');
const margin = { top: 40, right: 40, bottom: 80, left: 70 };
const chartHeight = 350;
const pieChartHeight = 280;

const Reportes = ({ navigation }) => {
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productosHistoricos, setProductosHistoricos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.goBack();
          return;
        }

        const token = await user.getIdToken();

        const response = await axios.get(
          `http://localhost:3000/reportes/ventas/${user.uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const historicoResponse = await axios.get(
          `http://localhost:3000/reportes/ventas/historico/${user.uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const procesarVentas = (venta) => ({
          ...venta,
          total_ventas: Number(venta.total_ventas),
          mes: formatMes(venta.mes),
        });

        const procesarProductos = (producto) => ({
          nombre: producto.nombre,
          cantidad_vendida: Number(producto.cantidad_vendida),
        });

        setVentasMensuales(response.data.ventasMensuales.map(procesarVentas));
        setProductosMasVendidos(
          response.data.productosMasVendidos.map(procesarProductos)
        );
        setProductosHistoricos(historicoResponse.data.map(procesarProductos));
      } catch (error) {
        console.error('Error obteniendo datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  const formatMes = (mesStr) => {
    const [year, month] = mesStr.split('-');
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return `${meses[parseInt(month) - 1]} ${year}`;
  };

  // Funciones para gráficos
  const calcularPorcentajes = (datos) => {
    const total = datos.reduce((acc, curr) => acc + curr.value, 0);
    return datos.map((d) => ({
      ...d,
      porcentaje: total > 0 ? ((d.value / total) * 100).toFixed(1) + '%' : '0%',
    }));
  };

  const xScale = scaleBand({
    domain: ventasMensuales.map((d) => d.mes),
    padding: 0.6,
    range: [margin.left, screenWidth - margin.right],
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...ventasMensuales.map((d) => d.total_ventas), 1)],
    nice: true,
    range: [chartHeight - margin.bottom, margin.top],
  });

  const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  const crearDatosPastel = (productos) =>
    productos.map((p, i) => ({
      label: p.nombre,
      value: p.cantidad_vendida,
      color: colores[i % colores.length],
    }));

  const escalaPastel = (datos) =>
    scaleOrdinal({
      domain: datos.map((d) => d.label),
      range: datos.map((d) => d.color),
    });

  const LeyendaPersonalizada = ({ scale, data }) => (
    <View style={styles.leyendaContainer}>
      {data.map((d, i) => (
        <View key={i} style={styles.leyendaItem}>
          <View
            style={[styles.leyendaColor, { backgroundColor: scale(d.label) }]}
          />
          <Text style={styles.leyendaTexto}>
            {d.label}: {d.value} unid. ({d.porcentaje})
          </Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Reportes de Ventas</Text>

      {/* Gráfico de Barras Mejorado */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Ventas Mensuales</Text>
        <Text style={styles.chartSubtitle}>
          Total últimos 6 meses: $
          {ventasMensuales
            .reduce((a, b) => a + b.total_ventas, 0)
            .toLocaleString()}
        </Text>
        <Svg width={screenWidth} height={chartHeight}>
          <GradientOrangeRed id="barGradient" />

          {ventasMensuales.map((d, i) => (
            <G key={`bar-${i}`}>
              <Bar
                x={xScale(d.mes)}
                y={yScale(d.total_ventas)}
                width={xScale.bandwidth()}
                height={chartHeight - margin.bottom - yScale(d.total_ventas)}
                fill="url(#barGradient)"
                rx={6}
              />
              <SvgText
                x={xScale(d.mes) + xScale.bandwidth() / 2}
                y={yScale(d.total_ventas) - 8}
                fontSize={12}
                fontWeight="500"
                fill="#2D3748"
                textAnchor="middle"
              >
                ${d.total_ventas.toLocaleString()}
              </SvgText>
            </G>
          ))}

          <AxisBottom
            scale={xScale}
            top={chartHeight - margin.bottom}
            stroke="#CBD5E0"
            strokeWidth={1}
            tickStroke="#CBD5E0"
            tickLabelProps={() => ({
              fill: '#4A5568',
              fontSize: 12,
              fontWeight: '500',
              textAnchor: 'middle',
            })}
            numTicks={ventasMensuales.length}
          />

          <AxisLeft
            scale={yScale}
            left={margin.left}
            stroke="#CBD5E0"
            strokeWidth={1}
            tickStroke="#CBD5E0"
            tickLabelProps={() => ({
              fill: '#4A5568',
              fontSize: 12,
              dx: '-10',
              fontWeight: '500',
            })}
            numTicks={6}
            label="Ventas Totales ($)"
            labelProps={{
              fill: '#2D3748',
              fontSize: 14,
              fontWeight: '600',
              dy: -40,
              dx: -20,
            }}
          />
        </Svg>
      </View>

      {/* Gráficos de Pastel Mejorados */}
      {productosMasVendidos.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Productos Más Vendidos (Últimos 6 Meses)
          </Text>
          <Text style={styles.chartSubtitle}>
            Total unidades vendidas:{' '}
            {productosMasVendidos.reduce((a, b) => a + b.cantidad_vendida, 0)}
          </Text>
          <Svg width={screenWidth} height={pieChartHeight}>
            <G
              transform={`translate(${screenWidth / 2},${pieChartHeight / 2})`}
            >
              <Pie
                data={calcularPorcentajes(
                  crearDatosPastel(productosMasVendidos)
                )}
                pieValue={(d) => d.value}
                outerRadius={110}
                innerRadius={70}
                padAngle={0.03}
                cornerRadius={4}
              >
                {(pie) =>
                  pie.arcs.map((arc, i) => (
                    <G key={`arc-${i}`}>
                      <path
                        d={pie.path(arc)}
                        fill={escalaPastel(
                          crearDatosPastel(productosMasVendidos)
                        )(arc.data.label)}
                        stroke="#FFF"
                        strokeWidth={2}
                      />
                    </G>
                  ))
                }
              </Pie>
            </G>
          </Svg>
          <LeyendaPersonalizada
            scale={escalaPastel(crearDatosPastel(productosMasVendidos))}
            data={calcularPorcentajes(crearDatosPastel(productosMasVendidos))}
          />
        </View>
      )}

      {productosHistoricos.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Histórico Completo de Ventas</Text>
          <Text style={styles.chartSubtitle}>
            Total histórico de unidades vendidas:{' '}
            {productosHistoricos.reduce((a, b) => a + b.cantidad_vendida, 0)}
          </Text>
          <Svg width={screenWidth} height={pieChartHeight}>
            <G
              transform={`translate(${screenWidth / 2},${pieChartHeight / 2})`}
            >
              <Pie
                data={calcularPorcentajes(
                  crearDatosPastel(productosHistoricos)
                )}
                pieValue={(d) => d.value}
                outerRadius={110}
                innerRadius={70}
                padAngle={0.03}
                cornerRadius={4}
              >
                {(pie) =>
                  pie.arcs.map((arc, i) => (
                    <G key={`historic-arc-${i}`}>
                      <path
                        d={pie.path(arc)}
                        fill={escalaPastel(
                          crearDatosPastel(productosHistoricos)
                        )(arc.data.label)}
                        stroke="#FFF"
                        strokeWidth={2}
                      />
                    </G>
                  ))
                }
              </Pie>
            </G>
          </Svg>
          <LeyendaPersonalizada
            scale={escalaPastel(crearDatosPastel(productosHistoricos))}
            data={calcularPorcentajes(crearDatosPastel(productosHistoricos))}
          />
        </View>
      )}

      <ExportarExcelButton
        ventas={ventasMensuales}
        productos={[...productosMasVendidos, ...productosHistoricos]}
      />

      {ventasMensuales.length === 0 && (
        <Text style={styles.sinDatos}>No hay datos disponibles</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7FAFC',
    minHeight: '100%',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: 120,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 24,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  leyendaContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leyendaColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  leyendaTexto: {
    fontSize: 14,
    color: '#4A5568',
    flexShrink: 1,
  },
  sinDatos: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Reportes;
