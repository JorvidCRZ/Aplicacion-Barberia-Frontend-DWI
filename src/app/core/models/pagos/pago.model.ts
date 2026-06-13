export type MetodoPago = 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';
export type TipoPago = 'RESERVA' | 'VENTA' | 'SERVICIO' | 'PRODUCTO' | 'MIXTO';

export interface PagoRequest {
  clienteId: number;
  barberoId: number;
  reservaId?: number;
  ventaId?: number;
  monto: number;
  metodo: MetodoPago;
  tipo: TipoPago;
}

export interface PagoResponse {
  id: number;
  clienteId: number;
  clienteNombre: string;
  barberoId: number;
  barberoNombre: string;
  reservaId: number;
  ventaId: number;
  monto: number;
  metodo: MetodoPago;
  tipo: TipoPago;
  fecha: string;
}

export interface HistorialPagoResponse {
  id: number;
  pagoId: number;
  clienteId: number;
  clienteNombre: string;
  fecha: string;
}

export interface ReservaPendienteResponse {
  id: number;
  clienteId: number;
  clienteNombre: string;
  clienteApellido: string;
  barberoId: number; 
  barberoNombre: string;
  montoTotal: number;
  servicios: string[];
}