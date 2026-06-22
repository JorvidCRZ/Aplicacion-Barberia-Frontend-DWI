export interface ResumenMetricas {
  ingresosTotales: number;
  reservasTotales: number;
  completadas: number;
  clientesActivos: number;
  clientesNuevos: number;
  ticketPromedio: number;
}

export interface IngresoDiario {
  fecha: string;
  total: number;
}

export interface ReservasDia {
  dia: string;
  completadas: number;
  canceladas: number;
}

export interface RendimientoBarbero {
  nombre: string;
  totalReservas: number;
}

export interface ServicioSolicitado {
  nombre: string;
  cantidad: number;
}
export interface MetricasFiltro {
  fechaInicio: string;
  fechaFin: string;
}