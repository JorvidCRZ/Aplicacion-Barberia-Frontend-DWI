import { CausaReclamo, EstadoReclamo, SolucionReclamo, TipoProblema, TipoReclamacion } from "./reclamo.enum.model";

export interface ReclamoAdjuntoResponse {
    idAdjunto: number;
    nombreOriginal: string;
    urlArchivo: string;
    tipoAdjunto: string | null;
    mimeType?: string;
    fechaSubida: string;
}

export interface ReclamoResponse {
    idReclamo: number;
    numeroReclamo: string;
    nombreCliente: string;
    correoCliente: string;
    telefonoCliente: string;
    tipoReclamacion: TipoReclamacion;
    tipoProblema: TipoProblema;
    causaReclamo: CausaReclamo;
    estadoReclamo: EstadoReclamo;
    solucionReclamo: SolucionReclamo;
    descripcion: string;
    notasInternas: string;
    montoReclamado: number; 
    montoCompensado: number;
    fechaOcurrencia: string;
    fechaReclamo: string;
    fechaResolucion: string;
    esPublico: boolean;
    adjuntos: ReclamoAdjuntoResponse[] | null;
}

export interface ReclamoRequest {
    idCliente?: number;
    idVenta?: number;
    idReserva?: number;
    nombreCliente: string;
    correoCliente?: string;
    telefonoCliente?: string;
    tipoDocumentoCliente?: string;
    numeroDocumentoCliente?: string;
    tipoReclamacion: TipoReclamacion;
    tipoProblema: TipoProblema;
    causaReclamo?: CausaReclamo;
    descripcion: string;
    montoReclamado?: number;
    fechaOcurrencia?: string;
    notasInternas?: string;
    idUsuarioResponsable?: number;
}

export interface ReclamoPublicoRequest {
    nombres: string;
    apellidos: string;
    email?: string;
    telefono?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    idVenta?: number;
    idReserva?: number;
    tipoReclamacion: TipoReclamacion;
    tipoProblema: TipoProblema;
    descripcion: string;
    montoReclamado?: number;
    fechaOcurrencia?: string;
}

export interface ReclamoSolucionRequest {
    estadoReclamo: EstadoReclamo;
    solucionReclamo?: SolucionReclamo;
    notasInternas?: string;
    montoCompensado?: number;
    descripcionSolucion?: string;
}

export interface ReclamoResumen {
    abiertos: number;
    enProceso: number;
    resueltos: number;
    cerrados: number;
    anulados: number;
    total: number;
}