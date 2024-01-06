import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const addIngredient = createAction(
  '[ShoppingList] Add Ingredient',
  props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
  '[ShoppingList] Add Ingredients',
  props<{ ingredient: Ingredient[] }>()
);

export const updateIngredient = createAction(
  '[ShoppingList] Update Ingredients',
  props<{ ingredient: Ingredient }>()
);

export const deleteIngredient = createAction(
  '[ShoppingList] Delete Ingredients'
);

export const startEdit = createAction(
  '[ShoppingList] Start Edit',
  props<{ index: number }>()
);

export const stopEdit = createAction(
  '[ShoppingList] Stop Edit'
);