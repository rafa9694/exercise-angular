import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import { setRecipes } from "./recipe.actions";

export interface State {
  recipes: Recipe[];
}


const initialState: State = {
  recipes: []
}

export const recipeReducer = createReducer(
  initialState,
  on(setRecipes, (state, { recipes }) => {
    return {
      ...state,
      recipes: [...recipes]
    }
  })
);