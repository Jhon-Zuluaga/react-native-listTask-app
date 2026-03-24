import { isValidTaskTitle, Task } from "../../entities/Task";
import { ITaskRepository } from "../../ports/ITaskRepository";


/*
  * Resultado de edición de tarea
*/
export type EditTaskResult =
  | { success: true; task: Task }
  | { success: false; error: "INVALID_TITLE" | "TASK_NOT_FOUND" };


/*
  * Caso de uso: Editar tarea
*/
export class EditTaskUseCase {

  // Inyección del repositorio
  constructor(private taskRepository: ITaskRepository) {}

  async execute(
    taskId: string,
    newTitle: string,
    currentTasks: Task[],
  ): Promise<EditTaskResult> {

    // Verificar si la tarea existe
    const task = currentTasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: "TASK_NOT_FOUND" };

    // Validar nuevo título
    if (!isValidTaskTitle(newTitle))
      return { success: false, error: "INVALID_TITLE" };

    // Actualizar tarea
    const updatedTask: Task = { ...task, title: newTitle.trim() };

    // Guardar cambios
    await this.taskRepository.update(updatedTask);
    return { success: true, task: updatedTask };
  }
}
