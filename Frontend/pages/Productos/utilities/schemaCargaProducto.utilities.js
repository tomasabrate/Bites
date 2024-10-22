import * as yup from "yup";

const schema = yup.object({
  nombre: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres.")
    .required("El nombre del producto es obligatorio"),
  descripcion: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres."),
  precio: yup.number().typeError("El precio debe ser un número").required("El precio del producto es obligatorio"),
  descuento: yup
    .number()
    .typeError("El descuento debe ser un número")
    .min(1, "El descuento es un numero entre 1 y 100")
    .max(100, "El descuento es un numero entre 1 y 100")
    .required("El descuento del producto es obligatorio"),
  cantidad: yup
    .number("Debe ser un numero")
    .typeError("La cantidad debe ser un número")
    .required("La cantidad del producto es obligatoria"),
  fecha_produccion: yup
    .date()
    .required("La fecha de produccion es obligatoria"),
  fecha_vencimiento: yup
    .date()
    .required("La fecha de vencimiento es obligatoria"),
  imagenes: yup.array().required("Minimo 1 imagen"),
});


export default schema;