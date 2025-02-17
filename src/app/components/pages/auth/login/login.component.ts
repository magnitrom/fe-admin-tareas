import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule  } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../model/auth.model';
import { login, loginSuccess } from '../../../../store/actions/auth.actions';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule , FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  showPassword: boolean = false;

  private router = inject(Router);
  private store = inject(Store<{ auth: AuthState }>);

  constructor(private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.usuario || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, ingresa tu usuario y contraseña.',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });
      return;
    }

    // Disparar la acción de login en Redux
    this.store.dispatch(login({ usuario: this.usuario, password: this.password, idUsuario: 0 }));

    this.authService.login(this.usuario, this.password).subscribe(
      response => {
        if (response.estado === 'SUCCESS') {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: response.mensaje,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          }).then(() => {
            // Guardar en Redux cuando el login es exitoso
            this.store.dispatch(loginSuccess({ 
              usuario: this.usuario, 
              password: this.password, 
              idUsuario: response.datos!.idUsuarios 
            }));
    
            // Redirigir al Dashboard
            this.router.navigate(['/dashboard']);
          });
    
          console.log('Usuario Logueado:', response.datos);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: response.mensaje,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }
      },
      error => {
        console.error('Error en el login:', error);
    
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'No se ha encontrado una cuenta con este usuario.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Inténtalo nuevamente.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }
      }
    );
  }



}
