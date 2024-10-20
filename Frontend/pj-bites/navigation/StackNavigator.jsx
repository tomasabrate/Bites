import Home from "../screens/Home";
import Productos from "../screens/Productos";
import DetalleProducto from "../screens/DetalleProducto";
import InterfazCliente from "../screens/InterfazCliente"; // Asegúrate de que la ruta sea correcta
import InterfazComerciante from "../screens/InterfazComerciante";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Productos" 
        component={Productos} 
      />
      <Stack.Screen 
        name="DetalleProducto" 
        component={DetalleProducto} 
      />
      <Stack.Screen 
        name="Interfaz Cliente" 
        component={InterfazCliente} 
        options={{ headerShown: false }} // Oculta la cabecera para esta pantalla
      />
      <Stack.Screen 
        name="Interfaz Comerciante" 
        component={InterfazComerciante} 
        options={{ headerShown: false }} // Oculta la cabecera para esta pantalla
      />
    </Stack.Navigator>
  );
}
