import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, switchMap, withLatestFrom } from "rxjs/operators";

import * as fromApp from '../../store/app.reducer';
import * as RecipesAcitons from './recipe.actions';
import { Recipe } from "../recipe.model";
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {

  fetchRecipes = createEffect(() => this.action$.pipe(
    ofType(RecipesAcitons.fetchRecipes),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://ng-curse-recipe-book-228dd-default-rtdb.firebaseio.com/recipes.json',
      )
    }), map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
      });
    }),
    map(recipes => {
      return RecipesAcitons.setRecipes({ recipes });
    })
  ))

  storeRecipes = createEffect(() => this.action$.pipe(
    ofType(RecipesAcitons.storeRecipes),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        'https://ng-curse-recipe-book-228dd-default-rtdb.firebaseio.com/recipes.json',
        recipesState.recipes
      )
    })
  ), { dispatch: false })

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) { }
}