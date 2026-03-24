import { IUserRepository } from "../../ports/IUserRepository";
import { User, isValidEmail, isValidPassword } from "../../entities/User";

/* 
  *  Resultado del login - El dominio define sus propios errores
*/
export type LoginResult =
  | { success: true; user: User }
  | {
      success: false;
      error:
        | "INVALID_EMAIL"
        | "INVALID_PASSWORD"
        | "USER_NOT_FOUND"
        | "WRONG_PASSWORD";
    };

/*
  * Caso de Uso: Login de Usuario
*/
export class LoginUseCase {

  // El caso de uso RECIBE el repositorio, nunca lo crea
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<LoginResult> {

    // Validaciones de Dominio (User entities)
    if (!isValidEmail(email)) {
      return { success: false, error: "INVALID_EMAIL" };
    }
    if (!isValidPassword(password)) {
      return { success: false, error: "INVALID_PASSWORD" };
    }

    // Buscar usuario (Lógica de negocio)
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    // Verificar contraseña (Simulación de hash)
    const passwordHash = `hash_${password}`;
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: "WRONG_PASSWORD" };
    }

    // Login exitoso
    return { success: true, user };
  }
}
