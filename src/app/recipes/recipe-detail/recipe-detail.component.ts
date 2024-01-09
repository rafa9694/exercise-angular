import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { map, switchMap } from 'rxjs/operators';
import { deleteRecipe } from '../store/recipe.actions';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.pipe(map(params => {
      return +params['id'];
    }), switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }), map((recipesState) => {
      return recipesState.recipes.find((recipe, index) => {
        return index === this.id;
      })
    })
    ).subscribe(recipe => {
      if (recipe) {
        this.recipe = recipe;
      }
    });
  }

  onAddToShoppingList() {
    this.store.dispatch(addIngredients({ ingredient: this.recipe.ingredients }))
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({ indexRecipe: this.id }));
    this.router.navigate(['/recipes']);
  }
}
