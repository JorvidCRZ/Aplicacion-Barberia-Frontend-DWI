export interface VentaDetalle {

  detalleVentaId?: number;
  productoId: number;
  productoNombre?: string;
  servicioId?: number;
  servicioNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;

}