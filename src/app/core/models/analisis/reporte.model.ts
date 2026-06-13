export interface FilaSemanal {
  dia: string;
  reservas: number;
  completadas: number;
  canceladas: number;
  ingresos: number;
}

export interface ReporteItem {
  icon: string;
  titulo: string;
  descripcion: string;
  tipo: string;
}

export enum EstadoReserva {
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',
  CONFIRMADA = 'CONFIRMADA',
  EN_PROCESO = 'EN_PROCESO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
  CANCELADA_AUTOMATICA = 'CANCELADA_AUTOMATICA',
  NO_ASISTIO = 'NO_ASISTIO'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  YAPE = 'YAPE',
  PLIN = 'PLIN',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export interface ReporteFiltro {
  desde: string;
  hasta: string;
  barberoId?: number;
  servicioId?: number;
  estado?: EstadoReserva;
  metodoPago?: MetodoPago;
}