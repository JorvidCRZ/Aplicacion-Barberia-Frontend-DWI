export interface Usuario {
  idUsuario: number;
  user: string;
  qrToken: string;
  password?: string;
}

export interface UsuarioTablaResponse {

    idUsuario: number;
    usuario: string;
    nombre: string;
    apellido: string;
    tieneQr: boolean;
    roles: string[];
    tienePin: boolean;
}


export interface AssignRolesRequest {
    roles: number[];
}


export interface Rol {
    idRol: number;
    nombre: string;
}

export interface Permiso {
    idPermiso: number;
    nombre: string;
    descripcion: string;
}