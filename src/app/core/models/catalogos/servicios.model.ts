export interface Servicio {
    servicioId: number;
    nombre: string;
    precio: number;
    categoriaId: number;
    categoriaNombre: string;
    duracion: number;
    descripcion?: string;
    publicado?: boolean;
    estado?: boolean;
    urlsMultimedia?: string[];
}

export interface ServicioRequest {
    nombre: string;
    precio: number;
    categoriaId: number;
    duracion: number;
    descripcion?: string;
    publicado?: boolean;
}

export interface ServicioFiltro {
    page?: number;
    size?: number;
    sort?: string;
    nombre?: string;
    categoriaId?: number;
    precioMin?: number;
    precioMax?: number;
}