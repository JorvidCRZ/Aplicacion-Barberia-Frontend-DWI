export interface ClienteResumen {

  totalClientes: number;
  deltaTotalClientes: string;

  clientesActivosMes: number;
  deltaClientesActivos: string;

  nuevosClientes: number;
  deltaNuevosClientes: string;

  retencion: number;
  deltaRetencion: string;

}
// ─── API Wrapper ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ─── Auth / Token (guardado en localStorage tras login) ──────────────────────
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  rol: string;
  permisos: string[];
}

// ─── Reserva (próxima cita) ───────────────────────────────────────────────────
export type EstadoReserva =
  | 'PENDIENTE_PAGO'
  | 'CONFIRMADA'
  | 'EN_PROCESO'
  | 'FINALIZADA'
  | 'CANCELADA'
  | 'CANCELADA_AUTOMATICA'
  | 'NO_ASISTIO';


export interface ReservaDTO {
  reservaId: number;
  clienteNombre: string;
  barberoNombre: string;
  servicio: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipoReserva: string;
  total: number;
  estado: EstadoReserva;
}

// ─── KPIs del cliente ─────────────────────────────────────────────────────────
export interface ClienteDetalleResumenDTO {
  totalReservas: number;
  totalCortes: number;
  totalCompras: number;
  totalGastado: number;
  ultimaVisita: string;    // 'YYYY-MM-DD'
}

// ─── Servicio ─────────────────────────────────────────────────────────────────
export interface ServicioResponseDTO {
  servicioId: number;
  nombre: string;
  precio: number;
  categoriaId: number;
  categoriaNombre: string;
  duracion: number;
  urlsMultimedia: string[];
}