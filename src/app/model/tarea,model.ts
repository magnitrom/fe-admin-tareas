export interface Tarea {
    idTareas: number;
    idUsuarios: number;
    idEstados: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: string | null;
    usuarioCreacion: string;
    fechaModificacion: string | null;
    usuarioModificacion: string | null;
}