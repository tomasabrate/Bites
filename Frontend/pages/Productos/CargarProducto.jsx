import React, { useState, useEffect } from 'react';
import DatePickerController from './components/DatePickerController';
import FormInputController from './components/FormInputController';
import ImagePickerController from './components/ImagePickerController'; // Asegúrate de importar correctamente
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';
import formatDate from './utilities/formatDate.utilities';
import BotonGenerico from '../../components/BotonGenerico';
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
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setValue('id_vendedor', 1);
    setValue('tipo', 'unidad');
    setValue('activo', 1);
  }, [setValue]);

  const showAlert = () => {
    Alert.alert('Alerta de publicación.', 'Producto publicado con éxito!', [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ]);
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tipo: selectedTipo,
      categorias: selectedCategories,
      fecha_produccion: formatDate(data.fecha_produccion),
      fecha_vencimiento: formatDate(data.fecha_vencimiento),
      imagenes: data.imagenes || [], // Asegúrate de manejar esto correctamente
    };

    try {
      const response = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showAlert();
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        Alert.alert('Error', 'Hubo un error al cargar el producto.');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <FlatList
      data={[{}]} // Agrega un elemento para renderizar el FlatList
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
          {/* Usar ImagePickerController aquí */}
          <ImagePickerController
            name="imagenes" // Nombre que usas para capturar las imágenes
            control={control}
            title="Seleccionar imágenes"
            errors={errors}
          />

          <BotonGenerico
            title="Publicar Producto!"
            color={'#ff8566'}
            onPress={handleSubmit(onSubmit)}
          />
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
