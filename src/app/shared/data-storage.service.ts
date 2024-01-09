import { Store } from '@ngrx/store';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Recipe } from '../recipes/recipe.model';

import { map, tap } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import { setRecipes } from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-curse-recipe-book-228dd-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(
      'https://ng-curse-recipe-book-228dd-default-rtdb.firebaseio.com/recipes.json',
    ).pipe(map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
      });
    }), tap(recipes => {
      this.store.dispatch(setRecipes({ recipes }));
    }));
  }
}