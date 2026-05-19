import { VentaDetalle } from '@/app/core/models/ventas/detalle.model';

export interface Venta {

  ventaId: number;

  clienteId?: number;

  clienteNombre?: string;

  barberoId?: number;

  barberoNombre?: string;

  fecha?: string;

  detalles?: VentaDetalle[];

  total?: number;

}