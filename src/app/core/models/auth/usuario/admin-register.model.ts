export interface AdminRegister {
    username: string;
    password: string;
    idRol: number;        
    nombre: string;
    apellido: string;
    telefono?: string;
    email?: string;
}