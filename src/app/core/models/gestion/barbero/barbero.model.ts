import { Persona } from "../persona/persona.model";

export interface Barbero {
  barberoId: number;
  persona: Persona;
  experiencia: number;
  fechaIngreso: string;
  ocupado: boolean;
  sueldo: number;
  comision: number;
  descripcion: string;
  fotoUrl?: string | null;
}