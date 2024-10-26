import Home from "../pages/Home";
import Productos from "../pages/Productos/Productos";
import DetalleProducto from "../pages/Productos/DetalleProducto";
import CargarProducto from "../pages/Productos/CargarProducto";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginSelection" component={LoginSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClienteProfile" component={ClienteProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ZorritoForm" component={cliente} options={{ headerShown: false }} />
      <Stack.Screen name="ComercioProfile" component={ComercioProfile} options={{ headerShown: false }} />
      <Stack.Screen name="InterfazComerciante" component={InterfazComerciante} options={{ headerShown: false }} />
      <Stack.Screen name="InterfazCliente" component={InterfazCliente} options={{ headerShown: false }} />
      <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
      <Stack.Screen name="MisPedidos" component={MisPedidos} options={{ headerShown: false }} />
      <Stack.Screen name="Locales" component={Locales} options={{ headerShown: false }} />
      <Stack.Screen name="Mapa" component={Mapa} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Productos" component={Productos} options={{ headerShown: false }} />
      <Stack.Screen name="Detalle Producto" component={DetalleProducto} options={{ headerShown: false }} />
      <Stack.Screen name="CargarProducto" component={CargarProducto} options={{ headerShown: false }} />
      <Stack.Screen name="Carrito" component={Cart} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Reportes" component={Reportes} options={{ headerShown: false }} />
      <Stack.Screen name="MisPedidosCo" component={MisPedidosCo} options={{ headerShown: false }} />
      <Stack.Screen name="FloatingButton" component={FloatingButton} options={{ headerShown: false }} />
      <Stack.Screen name="StatCard" component={StatCard} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  );
}
