import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [{
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
      },
      {
        path: 'index',
        redirectTo: 'auth/login',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () => import('./components/pages/auth/auth.module').then((m) => m.AuthModule)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        canActivate: [AuthGuard] // Protege la ruta con el guardia de autenticación
      },
    ]
  }
];
