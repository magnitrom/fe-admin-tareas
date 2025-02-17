import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ usuario: string; password: string, idUsuario: number }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ usuario: string; password: string, idUsuario: number }>()
);

export const logout = createAction('[Auth] Logout');
