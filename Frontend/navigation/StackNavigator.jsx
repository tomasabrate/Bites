import Home from "../pages/Home";
import Productos from "../pages/Productos/Productos";
import DetalleProducto from "../pages/Productos/DetalleProducto";
import CargarProducto from "../pages/Productos/CargarProducto";
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
      <Stack.Screen name="Productos" component={Productos} />
      <Stack.Screen name="DetalleProducto" component={DetalleProducto} />
      <Stack.Screen name="CargarProducto" component={CargarProducto} />
    </Stack.Navigator>
  );
}
