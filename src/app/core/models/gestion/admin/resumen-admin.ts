// ─── Respuesta genérica del backend ────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── Clientes ───────────────────────────────────────────────────────────────
export interface ClienteResumenResponseDTO {
  totalClientes: number;
  deltaTotalClientes: string;

  clientesActivosMes: number;
  deltaClientesActivos: string;

  nuevosClientes: number;
  deltaNuevosClientes: string;

  retencion: number;
  deltaRetencion: string;
}

export interface ClienteDetalleResumenDTO {
  totalReservas: number;
  totalCortes: number;
  totalCompras: number;
  totalGastado: number;
  ultimaVisita: string;
}

// ─── Barberos ───────────────────────────────────────────────────────────────
export interface ResumenBarberoDTO {
  // Tarjetas
  totalBarberos: number;
  disponibles: number;
  ocupados: number;
  // Ventas hoy
  ventasHoy: number;
  porcentajeVsAyer: string;
  // Mejor del mes
  mejorDelMes: string;
  totalGeneradoMejor: number;
}

// ─── Citas / Reservas ───────────────────────────────────────────────────────
export type EstadoReserva =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'EN_PROCESO'
  | 'COMPLETADA'
  | 'CANCELADA';

export type TipoReserva = 'PRESENCIAL' | 'ONLINE';

export interface DetalleReservaDTO {
  servicioNombre: string;
  precio: number;
  duracionMinutos: number;
}

export interface CitaBarberoResponseDTO {
  idReserva: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefonoCliente: string;
  fecha: string;         // LocalDate → string ISO "YYYY-MM-DD"
  horaInicio: string;    // LocalTime → string "HH:mm"
  estado: EstadoReserva;
  tipoReserva: TipoReserva;
  servicios: DetalleReservaDTO[];
}

export interface ReservaDTO {
  id: number;
  nombreCliente: string;
  telefonoCliente: string;
  nombreBarbero: string;
  servicios: string[];
  servicioResumen: string;
  fecha: string;            // LocalDate → "YYYY-MM-DD"
  duracionMinutos: number;
  totalPrecio: number;
  horaInicio: string;       // LocalTime → "HH:mm"
  horaFin: string;
  estado: EstadoReserva;
  tipoReserva: string;
}

// ─── Ventas ─────────────────────────────────────────────────────────────────
export interface DetalleVentaResponseDTO {
  detalleVentaId: number;
  ventaId: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaResponseDTO {
  ventaId: number;
  clienteId: number;
  clienteNombre: string;
  barberoId: number | null;
  barberoNombre: string | null;
  fecha: string;             // LocalDateTime → ISO string
  detalles: DetalleVentaResponseDTO[];
}

// ─── Modelo consolidado para el Dashboard ───────────────────────────────────
export interface DashboardData {
  clientes: ClienteResumenResponseDTO;
  barberos: ResumenBarberoDTO;
  ventas: VentaResponseDTO[];
  citas: CitaBarberoResponseDTO[];
}

// ─── KPI calculado (lo que se muestra en las tarjetas) ──────────────────────
export interface KpiCard {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: string;
}