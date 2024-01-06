import { createAction, props } from "@ngrx/store";

export const authenticateSuccess = createAction(
  '[Auth] Authenticate Success',
  props<{ email: string, userId: string, token: string, expirationDate: Date }>()
);

export const logout = createAction(
  '[Auth] Logout',
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string, password: string }>()
);

export const authenticateFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ message: string }>()
)

export const signup = createAction(
  '[Auth] Signup'
)

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ email: string, password: string }>()
)

export const clearError = createAction(
  '[Auth] Clear Error'
)

export const autoLogin = createAction(
  '[Auth] Auto Login'
)