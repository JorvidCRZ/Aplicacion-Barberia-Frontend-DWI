export interface ReservaRequest {
  clienteId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  horaInicio: string;
  observacion?: string;
  esGratis?: boolean;
}