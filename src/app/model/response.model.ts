export interface ResponseModel<T = any> {
    estado: 'SUCCESS' | 'ERROR';
    mensaje: string;
    datos: T | null;
  }
  