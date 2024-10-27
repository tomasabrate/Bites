import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id_producto === producto.id_producto
      );
      if (productoExistente) {
        // Si el producto ya está en el carrito, aumentamos la cantidad
        return prevCarrito.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Si el producto no está en el carrito, lo agregamos con cantidad 1
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  };


  const eliminarDelCarrito = useCallback((id_producto) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => item.id_producto !== id_producto)
    );
  }, []);

  const vaciarCarrito = useCallback(() => {
    setCarrito([]);
  }, []);

  //ARREGLAR - Quitar no funciona
  const quitarDelCarrito = useCallback((id_producto) => {
    const index = carrito.findIndex(id_producto);
    setCarrito(carrito.toSpliced(index, 1));
  }, []);



  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    quitarDelCarrito,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
