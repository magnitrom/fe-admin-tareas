import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response.model';
import { Observable, switchMap, take } from 'rxjs';
import { AuthState } from '../model/auth.model';
import { Estado } from '../model/estado.model';



@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  private http = inject(HttpClient);
  private store = inject(Store<{ auth: AuthState }>);
  private apiUrl = `${environment.API_URL}/api/estados`;

  constructor() {}

  getAllEstados(): Observable<ResponseModel> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(authState => {
        const headers = new HttpHeaders({
          Authorization: `Basic ${authState.authToken || ''}`
        });

        return this.http.get<ResponseModel>(this.apiUrl, { headers });
      })
    );
  }
}
