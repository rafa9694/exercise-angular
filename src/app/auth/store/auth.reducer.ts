import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import { authenticateSuccess, authenticateFail, loginStart, logout, signupStart, clearError } from "./auth.actions";

export interface State {
  user: User | null;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: '',
  loading: false
}

export const authReducer = createReducer(
  initialState,
  on(authenticateSuccess, (state, { email, userId, token, expirationDate }) => {
    const user = new User(email, userId, token, expirationDate);

    return {
      ...state,
      user: user,
      authError: '',
      loading: false
    }
  }),
  on(logout, (state) => {
    return {
      ...state,
      user: null,
      authError: ''
    }
  }),
  on(loginStart, (state) => {
    return {
      ...state,
      authError: '',
      loading: true
    }
  }),
  on(signupStart, (state) => {
    return {
      ...state,
      authError: '',
      loading: true
    }
  }),
  on(authenticateFail, (state, { message }) => {
    return {
      ...state,
      user: null,
      authError: message,
      loading: false
    }
  }),
  on(clearError, (state) => {
    return {
      ...state,
      authError: ''
    }
  })
)