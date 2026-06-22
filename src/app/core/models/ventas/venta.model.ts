import { VentaDetalle } from '@/app/core/models/ventas/detalle.model';

export interface Venta {

  ventaId: number;
  numeroCorrelativo?: string;
  clienteId?: number;
  clienteNombre?: string;
  fecha?: string;
  tipoComprobante?: 'BOLETA' | 'FACTURA';
  detalles?: VentaDetalle[];
  total?: number;

}

export interface VentaFiltro {
    cliente?: string;
    numeroCorrelativo?: string;
    tipoComprobante?: 'BOLETA' | 'FACTURA';
    fechaInicio?: string | Date;
    fechaFin?: string | Date;
    page?: number;
    size?: number;
    sort?: string;
}