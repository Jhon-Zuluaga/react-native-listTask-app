/**
 * Modelo User del sistema.
 */

export interface User{
    readonly id: string; 
    email: string;
    passwordHash: string;
    name: string;
    createdAt: Date;
}

// Valida si un email tiene formato correcto
export const isValidEmail = (email: string): boolean =>{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Valida la contraseña
* - Mínimo 6 caracteres
*/
export const isValidPassword = (password: string): boolean =>{
    return password.length >= 6;
}