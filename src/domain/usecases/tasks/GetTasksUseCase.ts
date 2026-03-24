import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../ports/ITaskRepository";

/*
  * Caso de uso: Obtener tareas de un usuario
*/
export class GetTasksUseCase {

  // Inyección del repositorio
  constructor(private taskRepository: ITaskRepository) {}

  // Retorna las tareas del usuario
  async execute(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId);
  }
}
