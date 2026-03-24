import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/authStore";
import { NavigationContainer } from "@react-navigation/native";
import { TasksScreen } from "../screens/TasksScreen";
import { LoginScren } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

/**
 * Navegador principal de la App
 * Decide qué pantallas mostrar según el estado de autenticación
 */
export const AppNavigator = () => {

  const user = useAuthStore((state) => state.user);
  const isRestoringSession = useAuthStore((state) => state.isRestoringSession);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  // Restaurar sesión al iniciar la app
  useEffect(() => {
    // ← TEMPORAL: limpia todos los datos y empieza de cero
    //AsyncStorage.clear().then(() => {
    restoreSession();
  }, []);

  // Loader mientras se restaura la sesión 
  if (isRestoringSession) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "f8f8fb",
        }}
      >
        <ActivityIndicator size="large" color="#534AB7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Si hay usuario -> entra a tareas */}
        {user ? (
          <Stack.Screen name="Tasks" component={TasksScreen} />
        ) : (
          <>
            { /* Si no hay usuario -> login/register */}
            <Stack.Screen name="Login" component={LoginScren} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
