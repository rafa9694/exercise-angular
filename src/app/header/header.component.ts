import { Component, OnDestroy, OnInit } from "@angular/core";
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import { logout } from '../auth/store/auth.actions';
import { fetchRecipes, storeRecipes } from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub!: Subscription;

  constructor(
    private store: Store<fromApp.AppState>) {

  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.store.dispatch(storeRecipes())
  }

  onFetchData() {
    this.store.dispatch(fetchRecipes());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}