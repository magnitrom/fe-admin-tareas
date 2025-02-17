import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../model/auth.model';
import { login, loginSuccess, logout } from '../store/actions/auth.actions';


export const initialState: AuthState = {
  usuario: '',
  password: '',
  autenticado: false,
  authToken: ''
};

export const authReducer = createReducer(
  initialState,
  on(login, (state, { usuario, password, idUsuario }) => ({
    ...state,
    usuario,
    password,
    idUsuario,
    authToken: btoa(`${usuario}:${password}`) // Convertir credenciales a Base64 para Basic Auth
  })),
  on(loginSuccess, (state, { usuario, password, idUsuario }) => ({
    ...state,
    usuario,
    password,
    idUsuario,
    autenticado: true,
    authToken: btoa(`${usuario}:${password}`)
  })),
  on(logout, () => initialState)
);
