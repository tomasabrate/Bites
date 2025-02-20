import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from "../pages/InicioApp/inicio";
import IntroScreen from "../pages/InicioApp/IntroScreen";
import LoginSelectionScreen from "../pages/InicioApp/LoginSelectionScreen";
import InterfazComerciante from "../pages/Comercio/InterfazComercio";
import InterfazCliente from "../pages/Cliente/InterfazCliente";
import MisPedidos from "../pages/Cliente/Mispedidos";
import Mapa from "../pages/Cliente/Mapa";
import Cart from "../pages/Cliente/Cart";
import Dashboard from "../pages/Comercio/Dashboard";
import Reportes from "../pages/Comercio/Reportes";
import FloatingButton from "../pages/Comercio/FloatingButton";
import StatCard from "../pages/Comercio/StatCard";
import ResumenCompra from "../pages/Cliente/ResumenCompra";
import Login from "../pages/InicioApp/Login";
import InterfazAdministrador from "../pages/Admin/interfazAdministrador";
import Registro from "../pages/registro/Registro";
import RegistroCliente from "../pages/registro/RegistroCliente";
import RegistroComercio from "../pages/registro/RegistroComercio";
import Productos from "../pages/Productos/Productos";
import DetalleProducto from "../pages/Productos/DetalleProducto";
import CargarProducto from "../pages/Productos/CargarProducto";
import ModificarProducto from "../pages/Productos/ModificarProducto";
import MisVentas from "../pages/Comercio/Ventas/MisVentas"
import DetalleVenta from "../pages/Comercio/Ventas/DetalleVenta";
import DetalleUsuario from "../pages/Admin/detalleUsuario";
import MisCompras from "../pages/Cliente/MisCompras"
import DetalleCompra from "../pages/Cliente/DetalleCompra";
import ModificarUsuario from "../pages/Admin/ModificarUsuario";
import PerfilCliente from "../pages/Cliente/PerfilCliente";
import PerfilComercio from "../pages/Comercio/PerfilComercio";
import ReseñaForm from '../pages/Cliente/resena';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Registro} />
      <Stack.Screen name="RegistroCliente" component={RegistroCliente} />
      <Stack.Screen name="RegistroComercio" component={RegistroComercio} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="IntroScreen" component={IntroScreen} />
      <Stack.Screen name="LoginSelection" component={LoginSelectionScreen} />
      <Stack.Screen
        name="InterfazComerciante"
        component={InterfazComerciante}
      />
      <Stack.Screen name="InterfazCliente" component={InterfazCliente} />
      <Stack.Screen name="reseñas" component={ReseñaForm} />
      <Stack.Screen name="MisPedidos" component={MisPedidos} />
      <Stack.Screen name="Mapa" component={Mapa} />
      <Stack.Screen name="Productos" component={Productos} />
      <Stack.Screen name="DetalleProducto" component={DetalleProducto} />
      <Stack.Screen name="CargarProducto" component={CargarProducto} />
      <Stack.Screen name="Carrito" component={Cart} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Reportes" component={Reportes} />
      <Stack.Screen name="MisVentas" component={MisVentas} />
      <Stack.Screen name="DetalleVenta" component={DetalleVenta} />
      <Stack.Screen name="FloatingButton" component={FloatingButton} />
      <Stack.Screen name="StatCard" component={StatCard} />
      <Stack.Screen name="ModificarProducto" component={ModificarProducto} />
      <Stack.Screen name="ResumenCompra" component={ResumenCompra} />
      <Stack.Screen
        name="InterfazAdministrador"
        component={InterfazAdministrador}
      />
      <Stack.Screen name="DetalleUsuario" component={DetalleUsuario} />
      <Stack.Screen name="MisCompras" component={MisCompras} />
      <Stack.Screen name="DetalleCompra" component={DetalleCompra} />
      <Stack.Screen name="ModificarUsuario" component={ModificarUsuario} />
      <Stack.Screen name="PerfilCliente" component={PerfilCliente} />
      <Stack.Screen name="PerfilComercio" component={PerfilComercio} />
    </Stack.Navigator>
  );
}
