import { isValidEmail, User } from "../../entities/User";
import { IUserRepository } from "../../ports/IUserRepository";

/*
  * Resultado de actualización del perfil
*/
export type UpdateProfileResult =
  | { success: true; user: User }
  | {
      success: false;
      error:
        | "INVALID_EMAIL"
        | "EMAIL_TAKEN"
        | "USER_NOT_FOUND"
        | "INVALID_NAME";
    };


/*
  * Caso de Uso: Actualizar perfil de usuario
*/
export class UpdateProfileUseCase {

  // Inyección del repositorio
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    updates: { name?: string; email?: string; password?: string },
  ): Promise<UpdateProfileResult> {

    // Buscar usuario
    const user = await this.userRepository.findById(userId);
    if (!user) return { success: false, error: "USER_NOT_FOUND" };

    // Validar email (si cambia)
    if (updates.email && updates.email !== user.email) {
      if (!isValidEmail(updates.email))
        return { success: false, error: "INVALID_EMAIL" };
      
      const existing = await this.userRepository.findByEmail(updates.email);
      if (existing) return { success: false, error: "EMAIL_TAKEN" };
    }

    // Validar nombre
    if (updates.name && updates.name.trim().length === 0) {
      return { success: false, error: "INVALID_NAME" };
    }

    // Construir usuario actualizado
    const updatedUser: User = {
      ...user,
      name: updates.name?.trim() ?? user.name,
      email: updates.email ?? user.email,
      passwordHash: updates.password
        ? `hash_${updates.password}`
        : user.passwordHash,
    };

    // Guardar cambios
    await this.userRepository.update(updatedUser);
    
    return { success: true, user: updatedUser };
  }
}
