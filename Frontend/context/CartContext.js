import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
  };

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id_producto) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id_producto !== id_producto));
  };


  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito , eliminarDelCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
