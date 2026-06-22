export type ProductoRequest = Omit< Producto,'id' | 'nombreCategoria' | 'urlsMultimedia'>;

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: boolean;
    publicado: boolean;
    idCategoria: number;
    nombreCategoria: string;
    urlsMultimedia: string[];
}

export interface ProductoFiltro {
    id?: number;
    nombre?: string;
    idCategoria?: number;
    estado?: boolean;
    publicado?: boolean;
    precioMin?: number;
    precioMax?: number;
    page?: number;
    size?: number;
    sort?: string;
}