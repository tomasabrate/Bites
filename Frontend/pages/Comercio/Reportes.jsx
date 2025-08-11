import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Rect,
  Path,
  G,
  Text as SvgText,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import ExportarExcelButton from '../../components/ExportarExcelButton';
import ViewShot from 'react-native-view-shot';
import BotonVolver from '../../components/BotonVolver';

import { API_URL_BACK } from '../../services/api_back';
const API_URL = API_URL_BACK + '/reportes';

const { width: screenWidth } = Dimensions.get('window');
const chartHeight = 350;
const pieChartHeight = 280;
const colores = ['#FF6B6B', '#FFA07A', '#FFD700', '#45B7D1', '#96CEB4'];
const darkBackground = '#1A1A1A';
const metallicBlack = '#2D2D2D';

const Reportes = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(screenWidth);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productosHistoricos, setProductosHistoricos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Referencias para capturar los gráficos
  const graficoBarrasRef = useRef(null);
  const graficoPastel1Ref = useRef(null);
  const graficoPastel2Ref = useRef(null);

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
          `${API_URL}/ventas/${user.uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const historicoResponse = await axios.get(
          `${API_URL}/ventas/historico/${user.uid}`,
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
    return windowWidth > 600
      ? `${meses[parseInt(month) - 1]} '${year.slice(2)}`
      : meses[parseInt(month) - 1];
  };

  const onLayoutContainer = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(Math.min(width - 40, screenWidth - 40));
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const GraficoBarras = () => {
    const margin = {
      top: 30,
      right: 20,
      bottom: windowWidth > 600 ? 80 : 60,
      left: 50,
    };

    const chartWidth = Math.max(
      containerWidth - margin.left - margin.right,
      300
    );
    const barSpacing = chartWidth / ventasMensuales.length;

    const xScale = (index) => margin.left + index * barSpacing;
    const maxValue = Math.max(...ventasMensuales.map((d) => d.total_ventas), 1);

    const yScale = (value) => {
      return (
        chartHeight -
        margin.bottom -
        (value / maxValue) * (chartHeight - margin.top - margin.bottom)
      );
    };

    return (
      <ViewShot
        ref={graficoBarrasRef}
        options={{ format: 'png', quality: 0.9 }}
        onLayout={onLayoutContainer}
        style={styles.chartContainer}
      >
        <Svg width={containerWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FF6B6B" />
              <Stop offset="100%" stopColor="#FF4500" />
            </LinearGradient>
          </Defs>

          {ventasMensuales.map((d, i) => {
            const barWidth = barSpacing * 0.6;
            const x = xScale(i) + barSpacing * 0.2;
            const y = yScale(d.total_ventas);
            const height = chartHeight - margin.bottom - y;

            return (
              <G key={`bar-${i}`}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  fill="url(#barGradient)"
                  rx={4}
                />
                {d.total_ventas > 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 8}
                    fontSize={windowWidth > 600 ? 12 : 10}
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    ${formatNumber(d.total_ventas)}
                  </SvgText>
                )}
                {d.total_ventas === 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight - margin.bottom - 10}
                    fontSize={10}
                    fill="#FF6B6B"
                    textAnchor="middle"
                  >
                    $0
                  </SvgText>
                )}
              </G>
            );
          })}

          <G transform={`translate(0, ${chartHeight - margin.bottom + 10})`}>
            {ventasMensuales.map((d, i) => (
              <SvgText
                key={`xlabel-${i}`}
                x={xScale(i) + barSpacing * 0.5}
                y={windowWidth > 600 ? 20 : 15}
                fontSize={windowWidth > 600 ? 12 : 10}
                fill="#FFFFFF"
                textAnchor="middle"
              >
                {d.mes}
              </SvgText>
            ))}
          </G>

          <Line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={chartHeight - margin.bottom}
            stroke="#666666"
            strokeWidth={1}
          />

          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick, i) => {
            const value = maxValue * tick;
            return (
              <G key={`ylabel-${i}`}>
                <SvgText
                  x={margin.left - 10}
                  y={yScale(value) + 4}
                  fontSize={windowWidth > 600 ? 12 : 10}
                  fill="#FFFFFF"
                  textAnchor="end"
                >
                  ${formatNumber(value)}
                </SvgText>
                <Line
                  x1={margin.left - 5}
                  y1={yScale(value)}
                  x2={margin.left}
                  y2={yScale(value)}
                  stroke="#666666"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                />
              </G>
            );
          })}
        </Svg>
      </ViewShot>
    );
  };

  const GraficoPastel = ({ datos, size }) => {
    const pieGenerator = d3Shape
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arcs = pieGenerator(datos);
    const outerRadius = size / 2.5;
    const innerRadius = outerRadius * 0.6;

    const arcGenerator = d3Shape
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padRadius(outerRadius)
      .padAngle(0.03)
      .cornerRadius(4);

    return (
      <View
        style={{
          width: size,
          height: size,
          alignSelf: 'center',
          marginVertical: 20,
        }}
      >
        <Svg width="100%" height="100%">
          <G transform={`translate(${size / 2}, ${size / 2})`}>
            {arcs.map((arc, i) => {
              const path = arcGenerator(arc);
              return (
                <G key={`pie-${i}`}>
                  <Path
                    d={path}
                    fill={datos[i].color}
                    stroke={metallicBlack}
                    strokeWidth={2}
                  />
                  <SvgText
                    x={arcGenerator.centroid(arc)[0]}
                    y={arcGenerator.centroid(arc)[1]}
                    fontSize={12}
                    fontWeight="500"
                    fill="#FFFFFF"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {datos[i].percentage}
                  </SvgText>
                </G>
              );
            })}
          </G>
        </Svg>
      </View>
    );
  };

  const GraficoPastelConCaptura = ({ datos, size, referencia }) => (
    <ViewShot
      ref={referencia}
      options={{ format: 'png', quality: 0.9 }}
      style={{
        width: size,
        height: size,
        alignSelf: 'center',
        marginVertical: 20,
      }}
    >
      <GraficoPastel datos={datos} size={size} />
    </ViewShot>
  );

  const Leyenda = ({ datos }) => (
    <View style={styles.leyendaContainer}>
      {datos.map((d, i) => (
        <View key={i} style={styles.leyendaItem}>
          <View style={[styles.leyendaColor, { backgroundColor: d.color }]} />
          <Text style={styles.leyendaTexto}>
            {d.label}: {d.value} unid. ({d.percentage})
          </Text>
        </View>
      ))}
    </View>
  );

  const generarDatosPastel = (productos) => {
    const total = productos.reduce(
      (acc, curr) => acc + curr.cantidad_vendida,
      0
    );
    return productos.map((p, i) => ({
      label: p.nombre,
      value: p.cantidad_vendida,
      percentage:
        total > 0
          ? ((p.cantidad_vendida / total) * 100).toFixed(1) + '%'
          : '0%',
      color: colores[i % colores.length],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { minHeight: windowHeight }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ position: 'absolute', top: 10, left: 10 }}>
        <BotonVolver />
      </View>

      <Text style={[styles.titulo, { fontSize: windowWidth > 600 ? 28 : 24 }]}>
        Reportes de Ventas
      </Text>

      <View
        style={[
          styles.chartCard,
          {
            width: windowWidth > 600 ? windowWidth * 0.9 : windowWidth * 0.95,
            marginHorizontal: windowWidth > 600 ? 20 : 10,
          },
        ]}
      >
        <Text
          style={[styles.chartTitle, { fontSize: windowWidth > 600 ? 22 : 18 }]}
        >
          Ventas Mensuales
        </Text>
        <Text style={styles.chartSubtitle}>
          Total últimos 6 meses: $
          {ventasMensuales
            .reduce((a, b) => a + b.total_ventas, 0)
            .toLocaleString()}
        </Text>
        <GraficoBarras />
      </View>

      {productosMasVendidos.length > 0 && (
        <View
          style={[
            styles.chartCard,
            {
              width: windowWidth > 600 ? windowWidth * 0.9 : windowWidth * 0.95,
              marginHorizontal: windowWidth > 600 ? 20 : 10,
            },
          ]}
        >
          <Text
            style={[
              styles.chartTitle,
              { fontSize: windowWidth > 600 ? 22 : 18 },
            ]}
          >
            Productos Más Vendidos (Últimos 6 Meses)
          </Text>
          <Text style={styles.chartSubtitle}>
            Total unidades vendidas:{' '}
            {productosMasVendidos.reduce((a, b) => a + b.cantidad_vendida, 0)}
          </Text>
          <GraficoPastelConCaptura
            datos={generarDatosPastel(productosMasVendidos)}
            size={windowWidth > 600 ? 400 : Math.min(windowWidth * 0.8, 300)}
            referencia={graficoPastel1Ref}
          />
          <Leyenda datos={generarDatosPastel(productosMasVendidos)} />
        </View>
      )}

      {productosHistoricos.length > 0 && (
        <View
          style={[
            styles.chartCard,
            {
              width: windowWidth > 600 ? windowWidth * 0.9 : windowWidth * 0.95,
              marginHorizontal: windowWidth > 600 ? 20 : 10,
            },
          ]}
        >
          <Text
            style={[
              styles.chartTitle,
              { fontSize: windowWidth > 600 ? 22 : 18 },
            ]}
          >
            Histórico Completo de Ventas
          </Text>
          <Text style={styles.chartSubtitle}>
            Total histórico de unidades vendidas:{' '}
            {productosHistoricos.reduce((a, b) => a + b.cantidad_vendida, 0)}
          </Text>
          <GraficoPastelConCaptura
            datos={generarDatosPastel(productosHistoricos)}
            size={windowWidth > 600 ? 400 : Math.min(windowWidth * 0.8, 300)}
            referencia={graficoPastel2Ref}
          />
          <Leyenda datos={generarDatosPastel(productosHistoricos)} />
        </View>
      )}

      <ExportarExcelButton
        ventas={ventasMensuales}
        productosMasVendidos={generarDatosPastel(productosMasVendidos)}
        productosHistoricos={generarDatosPastel(productosHistoricos)}
        graficoBarrasRef={graficoBarrasRef}
        graficoPastel1Ref={graficoPastel1Ref}
        graficoPastel2Ref={graficoPastel2Ref}
      />
    </ScrollView>
  );
};

// Los estilos se mantienen iguales que en tu código original
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: darkBackground,
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    overflow: 'hidden',
    marginVertical: 10,
  },
  chartCard: {
    backgroundColor: metallicBlack,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  titulo: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  chartTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkBackground,
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
    color: '#FFFFFF',
    flexShrink: 1,
  },
  sinDatos: {
    textAlign: 'center',
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Reportes;
