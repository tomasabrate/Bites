import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLogout = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
      await AsyncStorage.removeItem("@user");
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("No se pudo cerrar sesión:", error);
    }
  };

  return handleLogout;
};

export default useLogout;