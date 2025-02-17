import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../model/auth.model';
import { logout } from '../../../../store/actions/auth.actions';
import { Router } from '@angular/router';

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

    // Redirigir al Dashboard
    this.router.navigate(['/auth/login']);
  }

}
