import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../model/auth.model';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private store = inject(Store<{ auth: AuthState }>);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        if (authState.usuario) {
          return true; // Permite el acceso si el usuario existe en Redux
        } else {
          this.router.navigate(['/auth/login']); // Redirige al login si no hay usuario
          return false;
        }
      })
    );
  }
}
