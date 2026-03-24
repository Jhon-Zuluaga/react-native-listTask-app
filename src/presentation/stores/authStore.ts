import { create } from "zustand";
import { User } from "../../domain/entities/User";
import { LoginUseCase } from "../../domain/usecases/auth/LoginUseCase";
import { RegisterUser } from "../../domain/usecases/auth/RegisterUseCase";
import { AsyncStorageUserRepository } from "../../infrastructure/repositories/AsyncStorageUserRepository";
import { UpdateProfileUseCase } from "../../domain/usecases/auth/UpdateProfileUseCase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clave para guardar la session en AsyncStorage
const SESSION_KEY = "@hexagonal_session";

/**
 * Inyección de dependencias
 * Aqui conectamos infraestructura con dominio
 * (ARQUITECTURA HEXGONAL)
 */
const userRepo = new AsyncStorageUserRepository();
const loginUseCase = new LoginUseCase(userRepo);
const registerUseCase = new RegisterUser(userRepo);
const updatedProfileUseCase = new UpdateProfileUseCase(userRepo);

// Interfaz del estado
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isRestoringSession: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    email?: string;
    password?: string;
  }) => Promise<boolean>;
}

/**
 * Mapeo de Errores
 * Traduce errores del dominio a mensajaes UI
 */
const ERROR_MESSAGE: Record<string, string> = {
  INVALID_EMAIL: "El email no es válido",
  INVALID_PASSWORD: "La contraseña debe tener al menos 6 caracteres",
  USER_NOT_FOUND: "No existe una cuenta con ese email",
  WRONG_PASSWORD: "Contraseña incorrecta",
  EMAIL_TAKEN: "Ya existe una cuenta con ese emai",
  INVALID_NAME: "El nombre no puede estar vacío",
};

/**
 * Store de autenticación
 * Conecta; 
 * UI -> Store -> UseCases -> Repository
 */
export const useAuthStore = create<AuthState>((set, get) => ({

  // Estado inicial
  user: null,
  isLoading: false,
  isRestoringSession: true,
  error: null,

  // Login, autentica el usuario
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
 
      const result = await loginUseCase.execute(email, password);
      if (result.success) {
        await AsyncStorage.setItem(SESSION_KEY, result.user.id);
        set({ user: result.user, isLoading: false });
        return true;
      }
      
      // Manejo de error del dominio
      set({ error: ERROR_MESSAGE[result.error], isLoading: false });
      return false;

    } catch (e) {
      // Error inesperado
      const errorMsg = e instanceof Error ? e.message : String(e);
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  // Register, crear un nuevo usuario
  register: async (name, email, password) => {
  set({ isLoading: true, error: null });

  try {                                    
    const result = await registerUseCase.execute(name, email, password);

    if (result.success) {
      // Guardar sesion automaticamente
      await AsyncStorage.setItem(SESSION_KEY, result.user.id);
      set({ user: result.user, isLoading: false });
      return true;
    }

    set({ error: ERROR_MESSAGE[result.error], isLoading: false });
    return false;

  } catch (e) {

    const errorMsg = e instanceof Error ? e.message : String(e);
    set({ error: errorMsg, isLoading: false });
    return false;
  }
},

  // Logout, Cierra sesión del usuario
  logout: async () => {
    // Eliminar sesión almacenada
    await AsyncStorage.removeItem(SESSION_KEY);
    
    // Limpiar estado
    set({ user: null, error: null });
  },


  // Restore session, restaura la sesión al iniciar la app
  restoreSession: async () => {
    try {
      const userId = await AsyncStorage.getItem(SESSION_KEY);
      if (userId) {
        const user = await userRepo.findById(userId);
        if (user) {
          set({ user, isRestoringSession: false });
          return;
        }
      }
    } catch (e) {
      console.log("No se pudo restaurar la sesión", e);
    }
    // Si falla no hay sesión
    set({ isRestoringSession: false });
  },


  // Update profile, actualiza los datos del usuario
  updateProfile: async (updates: {

    name?: string;
    email?: string;
    password?: string;
  }) => {

    const { user } = get();
    if (!user) return false;

    set({ isLoading: true, error: null });
    const result = await updatedProfileUseCase.execute(user.id, updates);

    if (result.success) {
      set({ user: result.user, isLoading: false });
      return true;
    }
    
    set({ error: ERROR_MESSAGE[result.error], isLoading: false });
    return false;
  },
}));
