
export interface ImagenProductoUI {
    file?: File;
    preview: string;
    nombre: string;
    peso: string;
    tipo: 'nueva' | 'existente';
    urlOriginal?: string;
}