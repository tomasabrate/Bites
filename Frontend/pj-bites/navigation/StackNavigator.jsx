import Home from "../screens/Home"
import Productos from "../screens/Productos";
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
    </Stack.Navigator>
  );
}
