import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { registerStyle } from "../../../styles/registerStyle";

type Props = {
  navigation: any;
};


/**
 * Pantalla de registro de usuario 
 */
export const RegisterScreen = ({ navigation }: Props) => {

  // Tema (dark / light)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Estado de inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado y acciones del store
  const { register, isLoading, error } = useAuthStore();

  // Manejar registro
  const handleRegister = async () => {
    const success = await register(name, email, password);
    if (!success && error) Alert.alert("Error", error);
  };

  return (
    <View
      style={[
        registerStyle.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      <Text
        style={[registerStyle.title, { color: isDark ? "#fff" : "#1a1a2e" }]}
      >
        Crear cuenta
      </Text>
      <Text
        style={[registerStyle.subtitle, { color: isDark ? "#aaa" : "#666" }]}
      >
        Únete para empezar!
      </Text>

      {/* Input nombre */}
      <TextInput
        style={[
          registerStyle.input,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="Nombre"
        placeholderTextColor={isDark ? "#666" : "#999"}
        value={name}
        onChangeText={setName}
      />

      {/* Input nombre */}
      <TextInput
        style={[
          registerStyle.input,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="Email"
        placeholderTextColor={isDark ? "#666" : "#999"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input nombre */}
      <TextInput
        style={[
          registerStyle.input,
          {
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="Contraseña (mín. 6 caracteres)"
        placeholderTextColor={isDark ? "#666" : "#999"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Mostrar error */}
      {error && <Text style={registerStyle.error}>{error}</Text>}

      <TouchableOpacity
        style={registerStyle.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="fff" />
        ) : (
          <Text style={registerStyle.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
      
      {/* Volver al login */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={[
            registerStyle.link,
            { color: isDark ? "#a89cf7" : "#534AB7" },
          ]}
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};
