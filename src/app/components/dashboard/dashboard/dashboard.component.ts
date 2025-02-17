import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { RequiredCharComponent } from "../../../layout/shared/components/required-char/required-char.component";
import { TooltipModule } from '@cloudfactorydk/ng2-tooltip-directive';
import { CardComponent } from "../../../layout/shared/components/card/card.component";
import { Store } from '@ngrx/store';
import { AuthState } from '../../../model/auth.model';
import { TareasService } from '../../../services/tareas.service';
import { Tarea } from '../../../model/tarea,model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadosService } from '../../../services/estados.service';
import { Estado } from '../../../model/estado.model';
import { NavbarComponent } from "../../../layout/shared/components/navbar/navbar.component";
import { logout } from '../../../store/actions/auth.actions';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, RequiredCharComponent, TooltipModule, CardComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',

})
export class DashboardComponent {

  tareaForm: FormGroup;
  tareasActivas: Tarea[] = [];
  estadosDisponibles: Estado[] = [];
  usuario: string = '';
  idUsuarios: number = 0;
  modoEdicion: boolean = false;
  tareaIdEditando: number = 0;

  private store = inject(Store<{ auth: AuthState }>);
  private tareasService = inject(TareasService);
  private estadosService = inject(EstadosService);
  private fb = inject(FormBuilder);

  constructor() {
    this.store.select('auth').subscribe(authState => {
      this.usuario = authState.usuario;
      this.idUsuarios = authState.idUsuario;
    });
   

    this.tareaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      idEstados: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerEstados();
   // this.obtenerTareas();
  }

  obtenerTareas(): void {
    this.tareasService.getTareas().subscribe(
      response => {
        if (response.estado === 'SUCCESS') {
          this.tareasActivas = response.datos;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al Obtener Tareas',
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
          text: 'No se pudo conectar con el servidor para obtener las tareas.',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-primary' },
          buttonsStyling: false
        });
      }
    );
  }

  obtenerEstados(): void {
    this.estadosDisponibles=[];
    this.estadosService.getAllEstados().subscribe(
      response => {
        if (response.estado === 'SUCCESS') {
          this.estadosDisponibles = response.datos;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al Obtener Estados',
            text: response.mensaje,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }
      }
    );
  }

  tareaMovida(evt:any){
    this.obtenerEstados();
  }

  guardarTareas() {
    if (this.tareaForm.valid) {
      const nuevaTarea: Tarea = {
        idTareas: this.modoEdicion ? this.tareaIdEditando : 0,
        idUsuarios: this.idUsuarios,
        idEstados: this.tareaForm.value.idEstados,
        titulo: this.tareaForm.value.titulo,
        descripcion: this.tareaForm.value.descripcion,
        fechaCreacion: null,
        usuarioCreacion: this.usuario,
        fechaModificacion: null,
        usuarioModificacion: this.modoEdicion ? this.usuario : null
      };

      if (this.modoEdicion) {
        this.tareasService.updateTarea(nuevaTarea.idTareas, nuevaTarea).subscribe(() => {
          this.cancelarEdicion();
          this.obtenerEstados();
        });
      } else {
        debugger
        this.tareasService.crearTarea(nuevaTarea).subscribe(
          response => {
          if (response.estado === 'SUCCESS') {
            this.tareaForm.reset({ idEstados: 0 });
            this.obtenerEstados();
          Swal.fire({
            icon: 'success',
            title: 'Tarea Guardada',
            text: response.mensaje,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
          }           
        },
        error => {
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar la tareas',
            text: error.mensaje,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }
      );
      }
    }
  }

  editarTarea(tarea: Tarea) {
    this.modoEdicion = true;
    this.tareaIdEditando = tarea.idTareas;
    this.tareaForm.patchValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      idEstados: tarea.idEstados
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.tareaIdEditando = 0;
    this.tareaForm.reset({ idEstados: 0 });
  }

  
}
