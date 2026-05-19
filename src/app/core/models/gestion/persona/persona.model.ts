import { Usuario } from "../usuario.model";

export interface Persona {
  personaId: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  usuario: Usuario;
}