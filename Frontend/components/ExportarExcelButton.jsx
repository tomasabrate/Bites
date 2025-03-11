import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ExcelJS from 'exceljs';
import { captureRef } from 'react-native-view-shot';
import { Buffer } from 'buffer';

// Polyfill para React Native
global.Buffer = Buffer;

const ExportarExcelButton = ({
  ventas,
  productosMasVendidos,
  productosHistoricos,
  graficoBarrasRef,
  graficoPastel1Ref,
  graficoPastel2Ref,
}) => {
  const captureChart = async (ref) => {
    try {
      if (!ref.current) return null;

      const options = {
        format: 'png',
        quality: 1,
        result: Platform.OS === 'web' ? 'base64' : 'tmpfile',
        // No forzamos width/height aquí para preservar el layout original
      };

      const result = await captureRef(ref, options);
      if (Platform.OS === 'web') return `data:image/png;base64,${result}`;

      const base64 = await FileSystem.readAsStringAsync(result, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error capturando gráfico:', error);
      return null;
    }
  };

  const generarExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    // Capturar imágenes
    const [imgVentas, imgProductos, imgHistorico] = await Promise.all([
      captureChart(graficoBarrasRef),
      captureChart(graficoPastel1Ref),
      captureChart(graficoPastel2Ref),
    ]);

    // Función para agregar imágenes a las hojas
    // Función para agregar imágenes a la hoja, ahora con extDimensions
    const addImageToSheet = (sheet, imageBase64, startRow, extDimensions) => {
      if (!imageBase64) return;

      const imageId = workbook.addImage({
        base64: imageBase64,
        extension: 'png',
      });

      sheet.addImage(imageId, {
        tl: { col: 1, row: startRow },
        ext: extDimensions, // Ejemplo: { width: 800, height: 350 }
      });
    };

    // Hoja Ventas
    const ventasSheet = workbook.addWorksheet('Ventas');
    ventasSheet.addRow(['Reporte de Ventas Mensuales']);
    ventasSheet.addRow(['Mes', 'Total de Ventas (USD)']);
    ventas.forEach((v) => ventasSheet.addRow([v.mes, v.total_ventas]));
    addImageToSheet(ventasSheet, imgVentas, ventas.length + 4);

    // Hoja Productos
    const productosSheet = workbook.addWorksheet('Productos');
    productosSheet.addRow(['Productos Más Vendidos (Últimos 6 Meses)']);
    productosSheet.addRow(['Producto', 'Unidades Vendidas', 'Porcentaje']);
    productosMasVendidos.forEach((p) =>
      productosSheet.addRow([p.label, p.value, p.percentage])
    );
    addImageToSheet(
      productosSheet,
      imgProductos,
      productosMasVendidos.length + 4
    );

    // Hoja Histórico
    const historicoSheet = workbook.addWorksheet('Histórico');
    historicoSheet.addRow(['Histórico Completo de Ventas']);
    historicoSheet.addRow(['Producto', 'Unidades Vendidas', 'Porcentaje']);
    productosHistoricos.forEach((p) =>
      historicoSheet.addRow([p.label, p.value, p.percentage])
    );
    addImageToSheet(
      historicoSheet,
      imgHistorico,
      productosHistoricos.length + 4
    );

    // Generar archivo
    try {
      const buffer = await workbook.xlsx.writeBuffer();

      if (Platform.OS === 'web') {
        // Para web
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_ventas.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Para móvil
        const filename = FileSystem.documentDirectory + 'reporte_ventas.xlsx';
        await FileSystem.writeAsStringAsync(
          filename,
          Buffer.from(buffer).toString('base64'),
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        await Sharing.shareAsync(filename);
      }

      return true;
    } catch (error) {
      console.error('Error generando archivo:', error);
      return false;
    }
  };

  const handleExportPress = async () => {
    try {
      const success = await generarExcel();

      if (success) {
        Alert.alert('Éxito', 'Archivo Excel generado correctamente');
      } else {
        Alert.alert('Error', 'Error al generar el archivo');
      }
    } catch (error) {
      console.error('Error general:', error);
      Alert.alert('Error', 'Falló la generación del reporte');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleExportPress}>
      <Text style={styles.text}>Exportar a Excel</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ExportarExcelButton;
