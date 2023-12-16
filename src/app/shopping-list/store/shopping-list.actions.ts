import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const addIngredient = createAction(
  '[ShoppingList] ADD_INGREDIENT',
  props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
  '[ShoppingList] ADD_INGREDIENTS',
  props<{ ingredient: Ingredient[] }>()
);

export const updateIngredient = createAction(
  '[ShoppingList] UPDATE_INGREDIENT',
  props<{ ingredient: Ingredient }>()
);

export const deleteIngredient = createAction(
  '[ShoppingList] DELETE_INGREDIENT'
);

export const startEdit = createAction(
  '[ShoppingList] START_EDIT',
  props<{ index: number }>()
);

export const stopEdit = createAction(
  '[ShoppingList] STOP_EDIT'
);