import { isValidTaskTitle, Task } from "../../entities/Task";
import { ITaskRepository } from "../../ports/ITaskRepository";

/*
  * Resultado de creación de tarea 
*/
export type CreateTaskResult =
  | { success: true; task: Task }
  | { success: false; error: "INVALID_TITLE" };

/*
  * Caso de uso: Crear tarea
*/
export class CreateTasksUseCase {

  // Inyección de repositorio
  constructor(private taskRepository: ITaskRepository) {}

  async execute(userId: string, title: string): Promise<CreateTaskResult> {

    // Validar título
    if (!isValidTaskTitle(title)) {
      return { success: false, error: "INVALID_TITLE" };
    }

    // Crear tarea
    const task: Task = {
      id: Date.now().toString(),
      userId,
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };

    // Guardar tarea
    await this.taskRepository.save(task);
    return { success: true, task };
  }
}
