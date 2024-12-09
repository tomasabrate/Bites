import * as yup from "yup";

const schemaComercio = yup.object({
    nombre_comercio: yup
        .string()
        .min(3, "Minimo 3 caracteres")
        .max(250, "Maximo 250 caracteres.")
        .required("El nombre del comercio es obligatorio"),
    descripcion: yup
        .string()
        .min(3, "Minimo 3 caracteres")
        .max(250, "Maximo 250 caracteres."),
    direccion: yup
        .string()
        .min(3, "Minimo 3 caracteres")
        .max(250, "Maximo 250 caracteres.")
        .required("La dirección del comercio es obligatoria"),
    zonas_entrega: yup
        .string()
        .min(3, "Minimo 3 caracteres")
        .max(250, "Maximo 250 caracteres.")
        .required("La zona de entrega es obligatoria"),
    telefono: yup
        .string()
        .min(3, "Minimo 3 caracteres")
        .max(250, "Maximo 250 caracteres.")
        .required("El numero de telefono es obligatorio"),
    costo_entrega: yup
        .number()
        .typeError("El precio debe ser un número")
});


export default schemaComercio;
