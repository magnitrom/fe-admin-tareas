export interface Estado {
  idEstados: number;
  nombreEstado: string;
  descripcionEstado: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string | null;
  usuarioModificacion: string | null;
}