import React, { useState, useEffect } from 'react';
import DatePickerController from './components/DatePickerController';
import FormInputController from './components/FormInputController';
import ImagePickerController from './components/ImagePickerController';
import { View, StyleSheet, FlatList, Alert, Button } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';
import formatDate from './utilities/formatDate.utilities';
import axios from 'axios';
import schema from './utilities/schemaCargaProducto.utilities';

const categorias = [
  { value: 'Comida Rápida', key: 1 },
  { value: 'Saludable', key: 2 },
  { value: 'Bebidas', key: 3 },
  { value: 'Viandas', key: 4 },
  { value: 'Postres', key: 5 },
];

const tipos = [
  { value: 'Unidad', key: '1' },
  { value: 'Bolson', key: '2' },
];

export default function CargarProducto() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState([]);

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setValue('id_vendedor', 1);
    setValue('tipo', 'unidad');
    setValue('activo', 1);
  }, [setValue]);

  const showAlert = (message) => {
    Alert.alert('Estado de publicación', message, [
      { text: 'OK', onPress: () => console.log('Alerta cerrada') },
    ]);
  };

  const handleChauButtonPress = async () => {
    // Obtener los datos del formulario manualmente
    const data = getValues(); // Obtener los valores actuales del formulario

    console.log('Datos del formulario:', data); // Verifica si aquí se están obteniendo los valores correctos

    // Validar errores manualmente
    if (Object.keys(errors).length > 0) {
      console.log('El formulario tiene errores:', errors);
      showAlert('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      // Subir imágenes a Cloudinary
      const urlsImagenes = await Promise.all(
        (data.imagenes || []).map(async (imagen) => {
          const formData = new FormData();
          formData.append('file', {
            uri: imagen.uri,
            type: 'image/jpeg',
            name: `producto_${Date.now()}.jpg`,
          });
          formData.append('upload_preset', 'BitesPreset');
          formData.append('cloud_name', 'dturrtxzx');

          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dturrtxzx/image/upload',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          return response.data.secure_url;
        })
      );

      // Preparar datos para enviar al backend
      const formDataFinal = {
        ...data,
        tipo: selectedTipo,
        categorias: selectedCategories,
        fecha_produccion: formatDate(data.fecha_produccion),
        fecha_vencimiento: formatDate(data.fecha_vencimiento),
        imagenes: urlsImagenes.join(';'),
      };

      // Enviar datos al backend
      const response = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataFinal),
      });

      if (response.ok) {
        showAlert('Producto publicado con éxito!');
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        showAlert('Hubo un error al cargar el producto.');
      }
    } catch (error) {
      console.error('Error al subir imágenes o hacer la solicitud:', error);
      showAlert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <FlatList
      data={[{}]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => (
        <View style={styles.container}>
          <FormInputController
            control={control}
            name={'nombre'}
            placeholder={'Nombre del producto...'}
            errors={errors}
          />
          <FormInputController
            control={control}
            name={'descripcion'}
            placeholder={'Descripcion del producto...'}
            errors={errors}
          />
          <FormInputController
            control={control}
            name={'precio'}
            placeholder={'Precio del producto...'}
            keyboardType="numeric"
            errors={errors}
          />
          <MultipleSelectList
            setSelected={setSelectedCategories}
            label="Categorías..."
            data={categorias}
            styles={styles.picker}
            save="key"
          />
          <SelectList
            setSelected={setSelectedTipo}
            label="Tipo..."
            data={tipos}
            styles={styles.picker}
            save="key"
          />
          <DatePickerController
            control={control}
            name={'fecha_produccion'}
            title={'Fecha Producción'}
            errors={errors}
          />
          <DatePickerController
            control={control}
            name={'fecha_vencimiento'}
            title={'Fecha Vencimiento'}
            errors={errors}
          />
          <ImagePickerController
            name="imagenes"
            control={control}
            title="Seleccionar imágenes"
            errors={errors}
          />
          <Button title="Chau" onPress={handleChauButtonPress} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%',
    padding: 15,
  },
  picker: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    minWidth: '100%',
  },
});
