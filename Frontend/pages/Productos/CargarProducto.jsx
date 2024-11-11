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
  /* 
  Subir imágenes a Cloudinary:
Este proceso se realiza en el método handleChauButtonPress, específicamente en el bloque que utiliza Promise.all para iterar sobre las imágenes y subirlas a Cloudinary.
Aquí se obtiene cada URL de las imágenes subidas y se almacena en el array urlsImagenes.
*/
  const handleChauButtonPress = async () => {
    const data = getValues();
    console.log(data);

    if (Object.keys(errors).length > 0) {
      console.log('El formulario tiene errores:', errors);
      showAlert('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      console.log('Contenido de data.imagenes:', data.imagenes);
      console.log(
        'Tipo de data.imagenes:',
        Array.isArray(data.imagenes) ? 'Array' : typeof data.imagenes
      );

      const urlsImagenes = await Promise.all(
        (data.imagenes || []).map(async (imagen) => {
          const formData = new FormData();
          formData.append('file', imagen); // Asegúrate de que es un base64 o URI completo
          formData.append('upload_preset', 'BitesPreset');

          try {
            const response = await axios.post(
              'https://api.cloudinary.com/v1_1/dturrtxzx/image/upload',
              formData
            );
            return response.data.secure_url;
          } catch (error) {
            console.error('Error subiendo imagen:', error);
            return null; // Retorna null para excluirla si falla
          }
        })
      );

      const validUrlsImagenes = urlsImagenes.filter((url) => url !== null);

      // Verifica si se subieron imágenes
      if (validUrlsImagenes.length === 0) {
        showAlert('No se pudo cargar ninguna imagen. Intenta nuevamente.');
        return;
      }

      // Si solo hay una imagen, enviar solo la URL
      let imagenesFinales;
      if (validUrlsImagenes.length === 1) {
        imagenesFinales = validUrlsImagenes[0]; // Enviar solo la URL
      } else {
        // Si hay más de una, unirlas con ';'
        imagenesFinales = validUrlsImagenes.join(';');
      }

      // Ahora, crea el objeto final de los datos
      const formDataFinal = {
        ...data,
        tipo: selectedTipo,
        categorias: selectedCategories,
        fecha_produccion: formatDate(data.fecha_produccion),
        fecha_vencimiento: formatDate(data.fecha_vencimiento),
        imagenes: imagenesFinales, // Enviar solo una URL o las URLs separadas por ';'
      };

      console.log('Enviando formulario...');
      console.log(JSON.stringify(formDataFinal));
      console.log('Datos de las imagenes: ', formDataFinal.imagenes);

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
