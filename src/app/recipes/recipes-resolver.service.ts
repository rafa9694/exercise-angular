import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { map, switchMap, take } from "rxjs/operators";
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Recipe } from "./recipe.model";
import { of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private action$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          return this.action$.pipe(
            ofType(RecipesActions.setRecipes),
            take(1),
            map(recipe => recipe.recipes));
        } else {
          return of(recipes);
        }
      }));
  }

}