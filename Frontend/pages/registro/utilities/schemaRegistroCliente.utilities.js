import * as yup from "yup";

const schemaCliente = yup.object({
  nombre: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres.")
    .required("El nombre es obligatorio"),
  apellido: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres.")
    .required("El apellido es obligatorio"),
  fecha_nacimiento: yup
    .date()
    .required("La fecha de nacimiento es obligatoria"),
  domicilio: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres."),
  telefono: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres.")
    .required("El numero de telefono es obligatorio"),
});


export default schemaCliente;
