import { Button, StyleSheet, View, Text, Platform } from "react-native";
import { Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import BotonGenerico from "../../../components/BotonGenerico";
export default function DatePickerController({ control, name, title, errors }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Controller
        control={control}
        name={name} //identificador del controller
        render={({ field: { onChange, value } }) =>
          //seccion para web
          Platform.OS === "web" ? (
            <>
            <p style={styles.miniTitle}>{title}</p>
            <input
              style={styles.datePickerWeb}
              type="date"
              value={value ? value.toISOString().split("T")[0] : ""}
              onChange={(e) => onChange(new Date(e.target.value))}
            />
            </>
          ) : (
            //seccion para mobile
            <View style={styles.datePicker}>
              <BotonGenerico
                color="#26bdff"
                title={title} //texto del boton
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
          )
        }
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
    marginBottom: 20,
    marginTop: 10,
    padding: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  datePicker: {
    marginTop: 10,
    marginBottom: 10, // Espacio entre los DatePicker
    width: "100%",
  },
  datePickerWeb:{
    width:"90%",
    height: "15px",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  miniTitle:{
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
    color: "gray",
  }
});
