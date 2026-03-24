import { Task } from "../../entities/Task";
import { ITaskRepository } from "../../ports/ITaskRepository";


/*
  * Resultado de eliminación de tarea
*/
export type DeleteTaskResult =
  | { success: true }
  | { success: false; error: "TASK_NOT_FOUND" };


/*
  * Caso de uso: Eliminar tarea
*/
export class DeleteTaskUseCase {

  // Inyección del repositorio
  constructor(private taskRepository: ITaskRepository) {}

  async execute(
    taskId: string,
    currentTasks: Task[],
  ): Promise<DeleteTaskResult> {

    // Verificar si la tarea existe
    const task = currentTasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: "TASK_NOT_FOUND" };

    // Eliminar tarea
    await this.taskRepository.delete(taskId);
    return { success: true };
  }
}
