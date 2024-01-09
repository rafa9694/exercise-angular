import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import { logout } from "./store/auth.actions";


@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string = '';
  private tokeExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokeExpirationTimer = setTimeout(() => {
      this.store.dispatch(logout());
    }, expirationDuration)
  }

  clearLogoutTimer() {
    if (this.tokeExpirationTimer) {
      clearTimeout(this.tokeExpirationTimer);
      this.tokeExpirationTimer = null;
    }
  }

}