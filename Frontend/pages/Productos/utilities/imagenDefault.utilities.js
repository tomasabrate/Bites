import imgDefault from "../../../assets/default-featured-image.png";

const imagenDefault = (props) => {
  let imagen = new Image();
  props.imagenes && props.imagenes.length > 0
    ? (imagen = props.imagenes[0])
    : (imagen = imgDefault);
  return imagen;
};

export default imagenDefault;
