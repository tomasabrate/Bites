import { Button, StyleSheet, View, Text } from "react-native";
import {Controller} from "react-hook-form"
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
export default function DatePickerController({ control, name, label, errors }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Controller
        control={control}
        name={name} //identificador del controller
        render={({ field: { onChange, value } }) => (
          <View>
            <Text>{label}</Text>
            <Button
              title="Seleccionar Fecha"//texto del boton
              onPress={() => {
                setShow(true);
              }}
            />
            {show && (
              <DateTimePicker
                mode={"date"}
                value={value || new Date()}
                is24Hour={true}
                onChange={(event, selectedDate) => {
                  setShow(false);
                  onChange(selectedDate || value); // Actualiza la fecha
                }}
              />
            )}
          </View>
        )}
      />
      {errors && errors[name] && (
        <Text style={styles.inputError}>{errors[name].message}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inputError: {
    justifyContent: "space-between",
    color: "red",
    marginBottom: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
});
