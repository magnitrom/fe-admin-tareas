import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TooltipModule } from '@cloudfactorydk/ng2-tooltip-directive';
import { Estado } from '../../../../model/estado.model';
import { Tarea } from '../../../../model/tarea,model';
import { TareasService } from '../../../../services/tareas.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../model/auth.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() estado!: Estado;
  @Input() estados!: Estado[];
  @Output() tareaMovida = new EventEmitter<Tarea>();
  @Output() tareaEliminada = new EventEmitter<number>();
  
  tareas: Tarea[] = [];
  estadoAnterior: Estado | null = null;
  estadoSiguiente: Estado | null = null;
  usuarioActual: string = ''; 
  
  private tareasService = inject(TareasService);
  private store = inject(Store<{ auth: AuthState }>);

  optionTooltips = {
    'placement': 'bottom',
    'showDelay': 5,
    'hideDelay': 5
  };

  msjEliminarTarea: string = "Eliminar Tarea";
  msjRegresarEstado: string = "Regresar al estado anterior";
  msjCambioEstado: string = "Mover al siguiente estado";

  ngOnInit(): void {
    this.store.select('auth').subscribe(authState => {
      this.usuarioActual = authState.usuario; // Obtener el usuario desde Redux
    });

    if (this.estado && this.estado.idEstados) {
      this.obtenerTareasPorEstado(this.estado.idEstados);
      this.calcularEstados();
    }
  }

  obtenerTareasPorEstado(idEstado: number) {
    this.tareasService.getTareasByEstado(idEstado).subscribe(
      response => {
        this.tareas = response.estado === 'SUCCESS' && response.datos ? response.datos : [];
      },
      error => {
        console.error('Error obteniendo tareas:', error);
        this.tareas = [];
      }
    );
  }

  calcularEstados() {
    const index = this.estados.findIndex(e => e.idEstados === this.estado.idEstados);
    this.estadoAnterior = index > 0 ? this.estados[index - 1] : null;
    this.estadoSiguiente = index < this.estados.length - 1 ? this.estados[index + 1] : null;
  }

  moverTarea(tarea: Tarea, nuevoEstado: Estado) {
    const tareaActualizada: Tarea = {
      ...tarea,
      idEstados: nuevoEstado.idEstados,
      fechaModificacion: null,
      usuarioModificacion: this.usuarioActual 
    };

    
    this.tareasService.updateTarea(tareaActualizada.idTareas, tareaActualizada).subscribe(
      response => {
        if (response.estado === 'SUCCESS') {
          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: `La tarea se ha movido a ${nuevoEstado.nombreEstado}`,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });

          // Remover la tarea de la lista actual
          this.tareas = this.tareas.filter(t => t.idTareas !== tarea.idTareas);
          // Emitir el evento para actualizar la lista en el componente padre
          this.tareaMovida.emit(tareaActualizada);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: response.mensaje,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor para actualizar la tarea.',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-primary' },
          buttonsStyling: false
        });
      }
    );


  }

  eliminarTarea(idTarea: number) {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-secondary' },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareasService.deleteTarea(idTarea).subscribe(
          response => {
            if (response.estado === 'SUCCESS') {
              Swal.fire({
                icon: 'success',
                title: 'Tarea Eliminada',
                text: response.mensaje,
                confirmButtonText: 'Aceptar',
                customClass: { confirmButton: 'btn btn-primary' },
                buttonsStyling: false
              });

              // Remover la tarea de la lista actual
              this.tareas = this.tareas.filter(t => t.idTareas !== idTarea);
              // Emitir el evento para actualizar la lista en el componente padre
              this.tareaEliminada.emit(idTarea);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: response.mensaje,
                confirmButtonText: 'Aceptar',
                customClass: { confirmButton: 'btn btn-primary' },
                buttonsStyling: false
              });
            }
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo conectar con el servidor para eliminar la tarea.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'btn btn-primary' },
              buttonsStyling: false
            });
          }
        );
      }
    });
  }

  convertirFecha(fecha: string): string {
    // Dividir la fecha en partes: dd, MM, yyyy y hh, mm
    const [fechaParte, horaParte] = fecha.split(' ');
    const [dia, mes, anio] = fechaParte.split('/');
    const [hora, minutos] = horaParte.split(':');
  
    // Crear la cadena en formato ISO: yyyy-MM-ddTHH:mm:ss
    const fechaISO = `${anio}-${mes}-${dia}T${hora}:${minutos}:00`;
  
    // Crear el objeto Date
    const fechaObj = new Date(fechaISO); // Ahora tenemos la fecha en UTC (sin zona horaria)
  
    // Restar 6 horas para ajustar a UTC-06
    fechaObj.setHours(fechaObj.getHours() - 6);
  
    if (isNaN(fechaObj.getTime())) {
      console.error('Fecha inválida:', fecha);
      return ''; // Si la fecha es inválida, devolver un valor por defecto
    }
  
    // Establecer opciones de formato, incluyendo la hora en formato militar (24 horas) sin segundos
    const opciones = {
      timeZone: 'America/Tegucigalpa', // Zona horaria UTC-06 (Honduras)
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Esto asegura que se use el formato de 24 horas (hora militar)
    };
  
    return fechaObj.toLocaleString('es-HN', {
      timeZone: 'America/Tegucigalpa', // Zona horaria UTC-06 (Honduras)
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Esto asegura que se use el formato de 24 horas (hora militar)
    }); // Devolver la fecha formateada
  }
  
  
  

}
