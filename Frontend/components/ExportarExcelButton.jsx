// Frontend\components\ExportarExcelButton.jsx
import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
//import RNBlobUtil from 'react-native-blob-util';

const ExportarExcelButton = () => {
  const auth = getAuth();

  const descargarExcel = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const token = await user.getIdToken();

      const config = RNBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `Reporte_${Date.now()}.xlsx`,
          description: 'Archivo de reporte generado',
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          path: `${RNBlobUtil.fs.dirs.DownloadDir}/Reporte_${user.uid}.xlsx`,
        },
      });

      const response = await config.fetch(
        'GET',
        `http://localhost:3000/reportes/excel/${user.uid}`,
        { Authorization: `Bearer ${token}` }
      );

      if (response.info().status === 200) {
        Alert.alert('Éxito', 'Reporte descargado en:\n' + response.path(), [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al descargar');
      console.error('Error en descarga:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.boton} onPress={descargarExcel}>
      <Text style={styles.texto}>Exportar a Excel</Text>
    </TouchableOpacity>
  );
};

const styles = {
  boton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignSelf: 'center',
    minWidth: 200,
    alignItems: 'center',
  },
  texto: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
};

export default ExportarExcelButton;
