import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import { authenticateSuccess, logout } from "./store/auth.actions";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // user = new BehaviorSubject<User>(new User('', '', '', new Date));
  token: string = '';
  private tokeExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

  autoLogin() {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      return;
    }

    const userDataJSON: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(userData);

    const loadedUser = new User(userDataJSON.email, userDataJSON.id, userDataJSON._token, new Date(userDataJSON._tokenExpirationDate));

    if (loadedUser.token) {
      this.store.dispatch(authenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userDataJSON._tokenExpirationDate) }));
      const expirationDuration = new Date(userDataJSON._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(logout());
    localStorage.removeItem('userData');
    if (this.tokeExpirationTimer) {
      clearTimeout(this.tokeExpirationTimer);
    }
    this.tokeExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokeExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.store.dispatch(authenticateSuccess({ email: email, userId: userId, token: token, expirationDate: expirationDate }))
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error ocurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email exists already';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'This password or email is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}