export interface AuthState {
    usuario: string;
    password: string;
    autenticado: boolean;
    authToken: string; // Token para Basic Auth
}
