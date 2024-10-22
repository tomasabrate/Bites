const CalcularDescuento = (precio, descuento) =>{
  precio = precio - (precio * (descuento/100))
  return precio;
}

export default CalcularDescuento;