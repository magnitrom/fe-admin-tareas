import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario.model';
import { ResponseModel } from '../model/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient); // Inyección sin constructor
  private apiUrl = `${environment.API_URL}/api/usuario`;

  crearUsuario(usuario: Usuario): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl, usuario);
  }

  login(usuario: string, password: string): Observable<ResponseModel<Usuario>> {
    const url = `${this.apiUrl}/login?usuario=${usuario}`;

    // Configuración para Basic Auth (si es necesario)
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${usuario}:${password}`) // Reemplaza con credenciales válidas
    });

    return this.http.get<ResponseModel<Usuario>>(url, { headers });
  }

}
