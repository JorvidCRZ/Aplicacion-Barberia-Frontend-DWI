export interface VentaBarbero {
  ventaId: number;
  fecha: string;
  nombreCliente: string;
  total: number;
}

export interface ResumenBarbero {
  barberoId: number;
  nombreBarbero: string;
  sueldoBase: number;
  porcentajeComision: number;
  cantidadVentas: number;
  totalVentas: number;
  montoComision: number;
  sueldoFinal: number;
}