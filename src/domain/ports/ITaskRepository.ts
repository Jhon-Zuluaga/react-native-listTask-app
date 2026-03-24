import { Task } from "../entities/Task";

// Este es el CONTRATO. El dominio no sabe si usamos
// AsyncStorage, SQLITE o una api real solo sabe esto:

export interface ITaskRepository{
    findByUserId(userId: string): Promise<Task[]>;
    save(task: Task): Promise<void>;
    update(task: Task): Promise<void>;
    delete(taskId: string): Promise<void>;
}