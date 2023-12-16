import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import { addIngredient, addIngredients, deleteIngredient, startEdit, stopEdit, updateIngredient } from "./shopping-list.actions";

export interface AppState {
  shoppingList: State
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  editedIngredientIndex: number
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomates', 5)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
}

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, { ingredient }) => {
    return {
      ...state,
      ingredients: [...state.ingredients, ingredient]
    }
  }),
  on(addIngredients, (state, { ingredient }) => {
    return {
      ...state,
      ingredients: [...state.ingredients, ...ingredient]
    }
  }),
  on(updateIngredient, (state, { ingredient }) => {
    const ingredientOld = state.ingredients[state.editedIngredientIndex];
    const updatedIngredient = {
      ...ingredientOld,
      ...ingredient
    }
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
    return {
      ...state,
      ingredients: updatedIngredients,
      editedIngredientIndex: -1,
      editedIngredient: null
    }
  }),
  on(deleteIngredient, (state) => {
    return {
      ...state,
      ingredients: state.ingredients.filter((ig, igIndex) => {
        return igIndex !== state.editedIngredientIndex;
      }),
      editedIngredientIndex: -1,
      editedIngredient: null
    }
  }),
  on(startEdit, (state, { index }) => {
    return {
      ...state,
      editedIngredientIndex: index,
      editedIngredient: { ...state.ingredients[index] }
    }
  }),
  on(stopEdit, (state) => {
    return {
      ...state,
      editedIngredientIndex: -1,
      editedIngredient: null
    }
  })
);