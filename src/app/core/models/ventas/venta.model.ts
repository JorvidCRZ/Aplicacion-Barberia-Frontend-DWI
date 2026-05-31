import { VentaDetalle } from '@/app/core/models/ventas/detalle.model';

export interface Venta {

  ventaId: number;

  clienteId?: number;

  clienteNombre?: string;

  fecha?: string;

  tipoComprobante?: 'BOLETA' | 'FACTURA';

  detalles?: VentaDetalle[];

  total?: number;

}