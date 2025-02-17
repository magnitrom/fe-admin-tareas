import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../model/auth.model';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response.model';
import { Observable, switchMap, take } from 'rxjs';
import { Tarea } from '../model/tarea,model';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private http = inject(HttpClient);
  private store = inject(Store<{ auth: AuthState }>);
  private apiUrl = `${environment.API_URL}/api/tareas`;

  private authToken: string = '';

  constructor() {
    // Obtener el token de autenticación de Redux
    this.store.select('auth').subscribe(authState => {
      this.authToken = authState.authToken;
    });
  }

   /**
   * 🔹 Obtener tareas por estado (GET)
   * @param idEstado ID del estado a consultar
   */
   getTareasByEstado(idEstado: number): Observable<ResponseModel> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(authState => {
        const headers = new HttpHeaders({
          Authorization: `Basic ${authState.authToken || ''}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<ResponseModel>(`${this.apiUrl}/get-tarea-by-estado/${idEstado}`, { headers });
      })
    );
  }

  getTareas(): Observable<ResponseModel> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(authState => {
        const headers = new HttpHeaders({
          Authorization: `Basic ${authState.authToken || ''}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<ResponseModel>(this.apiUrl, { headers });
      })
    );
  }

  crearTarea(tarea: Tarea): Observable<ResponseModel> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${this.authToken}`
    });

    return this.http.post<ResponseModel>(this.apiUrl, tarea, { headers });
  }

  /**
   * 🔹 Actualizar una tarea (PUT)
   * @param idTarea ID de la tarea a actualizar
   * @param tarea Datos actualizados de la tarea
   */
  updateTarea(idTarea: number, tarea: Tarea): Observable<ResponseModel> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(authState => {
        const headers = new HttpHeaders({
          Authorization: `Basic ${authState.authToken || ''}`,
          'Content-Type': 'application/json'
        });

        return this.http.put<ResponseModel>(`${this.apiUrl}/${idTarea}`, tarea, { headers });
      })
    );
  }

  /**
   * 🔹 Eliminar una tarea (DELETE)
   * @param idTarea ID de la tarea a eliminar
   */
  deleteTarea(idTarea: number): Observable<ResponseModel> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(authState => {
        const headers = new HttpHeaders({
          Authorization: `Basic ${authState.authToken || ''}`
        });

        return this.http.delete<ResponseModel>(`${this.apiUrl}/${idTarea}`, { headers });
      })
    );
  }

}
