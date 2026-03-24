import { ITaskRepository } from "../../ports/ITaskRepository";

/*
 * Resultado de cambiar estado de tarea ( completada / no completada )
 */
export type ToggleResult =
  | { success: true }
  | { success: false; error: "TASK_NOT_FOUND" };

/*
 * Caso de uso: Alternar estado de una tarea
 */
export class ToggleTasksCase {

  // Inyección del repositorio
  constructor(private taskRepository: ITaskRepository) {}

  async execute(
    taskId: string,
    currentTasks: import("../../entities/Task").Task[],
  ): Promise<ToggleResult> {

    // Buscar tarea
    const task = currentTasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: "TASK_NOT_FOUND" };

    // Cambiar estado (true - false)
    await this.taskRepository.update({ ...task, completed: !task.completed });
    return { success: true };
  }
}
