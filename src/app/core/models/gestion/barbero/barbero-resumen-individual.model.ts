export interface ResumenIndividualBarbero {
  nombreBarbero: string;
  cortesEsteMes: number;
  ingresosGenerados: number;
  comisionGanada: number;
  reservasHoy: number;
}

export interface PerfilBarbero {
  barberoId: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  comision?: number;
  descripcion?: string;
  experiencia?: number;
  fechaIngreso?: string;
  fotoUrl?: string | null;
  ocupado: boolean;
  sueldo?: number;
}

export interface StatsHoy {
  enEspera?: number;
  enProceso?: number;
  completados?: number;
  totalDia?: number;
  totalIngresos?: number | null;
  reservas?: {
    reservaId: number;
    clienteNombre: string;
    barberoNombre: string;
    servicio: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    tipoReserva: string;
    total: number;
  }[];
}

export interface ServicioReserva {
  idDetalle?: number | null;
  nombreCorte: string;
  precio: number;
}

export interface Cita {
  idReserva: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefonoCliente?: string;
  fecha: string;
  horaInicio: string;
  estado: string;
  tipoReserva: string;
  servicios: ServicioReserva[];
  hora?: string;
  hora_inicio?: string;
}

export interface DiaResumen {
  fecha: string;
  atendidos: number;
  cancelados: number;
  totalIngresos: number;
}

export interface ResumenSemanal {

  dias: DiaResumen[];
  sueldoBase: number;
  comisionSemanal: number;
  totalSemana: number;
}

export interface EstadoResponse {
  estado?: string;
  status?: string;
}