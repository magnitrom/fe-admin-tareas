export interface Usuario {
    idUsuarios: number;
    usuario: string;
    nombre: string;
    correoElectronico: string;
    contrasenia: string;
    fechaCreacion?: string | null;
    usuarioCreacion: string;
    fechaModificacion?: string | null;
    usuarioModificacion?: string | null;
}
