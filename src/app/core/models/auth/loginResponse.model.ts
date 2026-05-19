export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    username: string;
    rol: string;
    permisos: string[];
  };

export interface LoginRequest {
    username: string;
    password: string;
}