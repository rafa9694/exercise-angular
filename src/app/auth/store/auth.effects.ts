import { AuthService } from '../auth.service';
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from '../../../environments/environment';
import * as AuthAcitons from './auth.actions';
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthAcitons.authenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error ocurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(AuthAcitons.authenticateFail({ message: errorMessage }));
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
  return of(AuthAcitons.authenticateFail({ message: errorMessage }));
};

@Injectable()
export class AuthEffects {

  authSignup = createEffect(() => this.action$.pipe(
    ofType(AuthAcitons.signupStart),
    switchMap(({ email, password }) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
        { email: email, password: password, returnSecureToken: true })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  ))

  authLogin = createEffect(() => this.action$.pipe(
    ofType(AuthAcitons.loginStart),
    switchMap((({ email, password }) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
        + environment.fireBaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
    )
  ));

  authRedirect = createEffect(() => this.action$.pipe(
    ofType(AuthAcitons.authenticateSuccess),
    tap(() => {
      this.router.navigate(['/']);
    })
  ), { dispatch: false });

  autoLogin = createEffect(() => this.action$.pipe(
    ofType(AuthAcitons.autoLogin),
    map(() => {
      const userData = localStorage.getItem('userData');

      if (!userData) {
        return {
          type: 'DUMMY'
        }
      }

      const userDataJSON: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(userData);

      const loadedUser = new User(userDataJSON.email, userDataJSON.id, userDataJSON._token, new Date(userDataJSON._tokenExpirationDate));

      if (loadedUser.token) {
        const expirationDuration = new Date(userDataJSON._tokenExpirationDate).getTime() - new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);

        return AuthAcitons.authenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userDataJSON._tokenExpirationDate)
        });
      }

      return {
        type: 'DUMMY'
      }
    })
  ));

  authLogout = createEffect(() => this.action$.pipe(
    ofType(AuthAcitons.logout),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  ), { dispatch: false });

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {

  }
}