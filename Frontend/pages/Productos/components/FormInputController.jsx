import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
// import { TextInput } from "react-native-gesture-handler";

//Input generico
export default function FormInputController({
  control,
  errors,
  name,
  placeholder,
}) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors && errors[name] && (
        <Text style={styles.inputError}>{errors[name]?.message}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    width: "100%",
  },
  inputError: {
    justifyContent: "space-between",
    color: "red",
    marginBottom: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  // label:{
  //   marginBottom: 5,
  //   fontSize: 14,
  //   fontWeight: "bold",
  //   color: "gray"
  // }
});
