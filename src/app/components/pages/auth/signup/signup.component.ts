import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TooltipModule } from '@cloudfactorydk/ng2-tooltip-directive';
import { RequiredCharComponent } from "../../../../layout/shared/components/required-char/required-char.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { Usuario } from '../../../../model/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, TooltipModule, RequiredCharComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  @Input() idEstado = 0;
  private router = inject(Router);
  registroForm: FormGroup;
  showPassword: boolean = false;
  showPasswordRep: boolean = false;

  optionTooltips = {
    'placement': 'right',
    'showDelay': 5,
    'hideDelay': 5
  }

  mostrarContrasenia = "Mostrar Contraseña";
  ocultarContrasenia = "Ocultar Contraseña";
  msjContrasenia = this.mostrarContrasenia;
  msjContraseniaRep = this.mostrarContrasenia;

  constructor(private fb: FormBuilder, private usuarioService: AuthService) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      contrasenia: ['', [Validators.required]],
      contraseniaRep: ['', Validators.required]
    });
  }

  togglePasswordVisibility(tipo: string) {
    if (tipo === 'pass') {
      this.showPassword = !this.showPassword;
      this.msjContrasenia = this.showPassword ? this.ocultarContrasenia : this.mostrarContrasenia;
    } else {
      this.showPasswordRep = !this.showPasswordRep;
      this.msjContraseniaRep = this.showPasswordRep ? this.ocultarContrasenia : this.mostrarContrasenia;
    }
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const formateo = this.registroForm.value;
      delete formateo.contraseniaRep;
  
      const usuarioData: Usuario = { 
        ...formateo, 
        idUsuarios: 0, 
        fechaCreacion: null, 
        usuarioCreacion: formateo.usuario, 
        fechaModificacion: null, 
        usuarioModificacion: null 
      };
  
      this.usuarioService.crearUsuario(usuarioData).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Registro Exitoso',
            text: response.mensaje || 'Tu cuenta ha sido creada correctamente, ya puedes iniciar sesión.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
          
            // Redirigir al Dashboard
            this.router.navigate(['/auth/login']);
        },
        error => {
          console.error('Error en la petición:', error);
      
          let errorMessage = 'Ocurrió un error inesperado.';
          let errorTitle = 'Error en el registro';
          let iconType: any = 'error';
      
          switch (error.status) {
            case 400:
              errorMessage = error.error.mensaje || 'Solicitud incorrecta. Verifica los datos.';
              break;
            case 401:
              errorMessage = error.error.mensaje || 'No autorizado. Debes iniciar sesión.';
              break;
            case 403:
              errorMessage = error.error.mensaje || 'No tienes permisos para realizar esta acción.';
              break;
            case 404:
              errorMessage = error.error.mensaje || 'Recurso no encontrado.';
              break;
            case 409:
              errorMessage = error.error.mensaje || 'Conflicto. El usuario ya existe.';
              break;
            case 500:
              errorMessage = error.error.mensaje || 'Error interno en el servidor.';
              break;
            case 503:
              errorMessage = error.error.mensaje || 'El servicio no está disponible en este momento.';
              break;
            default:
              errorMessage = error.error?.mensaje || 'Error desconocido.';
              break;
          }
      
          Swal.fire({
            icon: iconType,
            title: errorTitle,
            text: errorMessage,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }
      );
      
      
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor, completa todos los campos obligatorios.',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });
    }
  }
  
}
