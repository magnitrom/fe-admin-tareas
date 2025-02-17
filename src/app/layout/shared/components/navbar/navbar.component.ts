import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../model/auth.model';
import { logout } from '../../../../store/actions/auth.actions';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
  private store = inject(Store<{ auth: AuthState }>);

  private router = inject(Router);
  
  onLogout() {
    this.store.dispatch(logout()); // Despachar la acción de logout

      Swal.fire({
        icon: 'warning',
        title: 'Ha Cerrado Sesión',
        text: 'Feliz Día',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });
      
    // Redirigir al Dashboard
    this.router.navigate(['/auth/login']);
  }

}
