export interface BarberoRegister {
  username: string;
  password: string;
  idRol: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  experiencia: number;
  sueldo: number;
  comision: number;
  descripcion: string;
  fotoUrl: string | null;
}