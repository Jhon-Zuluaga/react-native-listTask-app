import { isValidEmail, isValidPassword, User } from "../../entities/User";
import { IUserRepository } from "../../ports/IUserRepository";

/*
 * Resultado del registro de usuario
*/
export type RegisterResult =
  | { success: true; user: User }
  | {
      success: false;
      error: "INVALID_EMAIL" | "INVALID_PASSWORD" | "EMAIL_TAKEN";
    };

/*
  * Caso de uso: Registro de usuario
*/
export class RegisterUser {

  // Inyección del repositorio
  constructor(private userRepository: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResult> {

    // Validaciones
    if (!isValidEmail(email)) return { success: false, error: "INVALID_EMAIL" };
    if (!isValidPassword(password))
      return { success: false, error: "INVALID_PASSWORD" };

    // Verifica si el email ya existe
    const existing = await this.userRepository.findByEmail(email);
    if (existing) return { success: false, error: "EMAIL_TAKEN" };

    // Crear Usuario (simulación hash)
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      passwordHash: `hash_${password}`,
      createdAt: new Date(),
    };

    // Guardar Usuario
    await this.userRepository.save(newUser);
    
    return { success: true, user: newUser };
  }
}
