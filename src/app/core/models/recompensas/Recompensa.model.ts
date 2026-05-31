export interface Recompensa {
  recompensaId: number;
  clienteId: number;
  nombreCliente: string;
  cortesAcumulados: number;
  cortesGratis: number;
  cortesParaProximo: number;
  tieneCorteGratis: boolean;
  fechaActualizacion: string;
}