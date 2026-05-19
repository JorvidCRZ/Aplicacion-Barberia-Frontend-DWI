export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    padreId: number | null;
    padreNombre: string | null;
    tipo: CategoriaTipo;
    subcategorias?: Categoria[];
}

export interface CategoriaFilter {
    page?: number;
    size?: number;
    sort?: string;
    nombre?: string;
    estado?: boolean;
    padreId?: number;
    tipo?: CategoriaTipo;
}

export interface CategoriaRequest {
    nombre: string;
    descripcion: string;
    estado: boolean;
    padreId: number | null;
    tipo: CategoriaTipo;
}

export enum CategoriaTipo {
    PRODUCTO = 'PRODUCTO',
    SERVICIO = 'SERVICIO'
}