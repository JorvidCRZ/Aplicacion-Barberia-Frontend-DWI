export interface ProductoResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: boolean;
    publicado: boolean;
    categoriaId: number;
    nombreCategoria: string;
    imagenes: string[];
}