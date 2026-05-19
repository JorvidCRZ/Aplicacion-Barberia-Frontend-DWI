import { Persona } from "../persona/persona.model";

export interface Cliente {
  clienteId: number;
  persona: Persona;
  fechaRegistro: string;
}

