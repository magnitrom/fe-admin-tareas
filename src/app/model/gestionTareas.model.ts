export class Usuario {
    idUsuarios: number = 0;
    usuario: string = "";
    nombre: string = "";
    correoElectronico: string = "";
    contrasenia: string = "";
    fechaCreacion: string = "";
    usuarioCreacion: string = "";
    fechaModificacion: string = "";
    usuarioModificacion: string = "";
}

export class ResponseObject {
    estado: string = "";
    mensaje: string = "";
    datos: any = ""
}

export class Tarea{
    idTareas: number = 0;
    idUsuarios: number = 0;
    idEstados: number = 0;
    titulo: string = "";
    descripcion: string = "";
    fechaCreacion: string = "";
    usuarioCreacion: string = "";
    fechaModificacion: string = "";
    usuarioModificacion: string = "";
}

export class Estados{
    idEstados: number = 0;
    nombreEstado: string = '';
    descripcionEstado: string = '';
    fechaCreacion: string = '';
    usuarioCreacion: string = '';
    fechaModificacion: string = '';
    usuarioModificacion: string = '';
}