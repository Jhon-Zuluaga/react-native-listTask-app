import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginStyle } from "../../../styles/loginStyle";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

/**
 * Pantalla de inicio de sesión
 */
export const LoginScren = ({ navigation }: Props) => {

  // Detectar modo oscuro
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Estado de inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado y acciones del store
  const { login, isLoading, error } = useAuthStore();

  // Manejar login
  const handleLogin = async () => {
    const success = await login(email, password);
    if (!success && error) Alert.alert("Error", error);
  };

  return (
    <View style={loginStyle.container}>
      <Text style={loginStyle.title}>Bienvenido!</Text>
      <Text style={loginStyle.subtitle}>Inicia sesión para continuar</Text>

      {/* Input email */}
      <TextInput
        style={[
          loginStyle.input,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input contraseña */}
      <TextInput
        style={[
          loginStyle.input,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Mostrar error */}
      {error && <Text style={loginStyle.error}>{error}</Text>}
      

      {/* Botón login */}
      <TouchableOpacity
        style={loginStyle.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={loginStyle.buttonText}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>
        
      {/* Navegar a registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text
          style={[loginStyle.link, { color: isDark ? "#a89cf7" : "#534AB7" }]}
        >
          ¿No tienes cuenta? Registrate
        </Text>
      </TouchableOpacity>
    </View>
  );
};
