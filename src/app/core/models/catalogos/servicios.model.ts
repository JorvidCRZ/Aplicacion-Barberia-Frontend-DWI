export interface Servicio {
    servicioId: number;
    nombre: string;
    precio: number;
    categoriaId: number;
    categoriaNombre: string;
    duracion: number;
    urlsMultimedia: string[];
}

export interface ServicioRequest {
    nombre: string;
    precio: number;
    categoriaId: number;
    duracion: number;
}