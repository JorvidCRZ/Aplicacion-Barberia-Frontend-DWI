export type EstadoCita =
  | 'PENDIENTE_PAGO'
  | 'CONFIRMADA'
  | 'EN_PROCESO'
  | 'FINALIZADA'
  | 'CANCELADA'
  | 'CANCELADA_AUTOMATICA'
  | 'NO_ASISTIO';

export interface ServicioReservaDTO {
  idDetalle: number | null;
  nombreCorte: string;
  precio: number;
}

export interface CitaBarberoResponseDTO {
  idReserva: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefonoCliente: string;
  fecha: string;       // "2026-05-16"
  horaInicio: string;
  estado: EstadoCita;
  tipoReserva: string;
  servicios: ServicioReservaDTO[];
}