import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import { addRecipe, deleteRecipe, setRecipes, updateRecipe } from "./recipe.actions";

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
  }),
  on(addRecipe, (state, { recipe }) => {
    return {
      ...state,
      recipes: [...state.recipes, recipe]
    }
  }),
  on(updateRecipe, (state, { index, newRecipe }) => {
    const updateRecipe = {
      ...state.recipes[index],
      ...newRecipe
    };

    const updateRecipes = [...state.recipes];

    updateRecipes[index] = updateRecipe;

    return {
      ...state,
      recipes: updateRecipes
    }
  }),
  on(deleteRecipe, (state, { indexRecipe }) => {
    return {
      ...state,
      recipes: state.recipes.filter((recipe, index) => {
        return index !== indexRecipe;
      })
    }
  })
);