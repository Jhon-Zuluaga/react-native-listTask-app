/**
 * Modelo Task del sistema.
 */

export interface Task{
    readonly id: string;
    userId: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

/* Validación el título de una tarea
* - No vacío
* - Máximo 100 caracteres
*/ 
export const isValidTaskTitle = (title: string): boolean => {
    return title.trim().length > 0 && title.trim().length <= 100
};