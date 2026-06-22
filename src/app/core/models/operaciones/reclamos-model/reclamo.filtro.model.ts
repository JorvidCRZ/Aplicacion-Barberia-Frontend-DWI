import { CausaReclamo, EstadoReclamo, TipoProblema, TipoReclamacion } from "./reclamo.enum.model";

export interface ReclamoFiltro {
    page?: number;
    size?: number;
    sort?: string;
    numeroReclamo?: string;
    nombreCliente?: string;
    estado?: EstadoReclamo;
    tipoProblema?: TipoProblema;
    tipoReclamacion?: TipoReclamacion;
    causaReclamo?: CausaReclamo;
    esPublico?: boolean;
    idResponsable?: number;
    numeroDocumentoCliente?: string;
    fechaInicio?: string;
    fechaFin?: string;
}