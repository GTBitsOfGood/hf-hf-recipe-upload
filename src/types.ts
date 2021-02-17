export interface IngredientSection {
  title: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  amount: string;
  notes: string;
}

export interface Recipe {
  title: string;
  yield: number;
  prepTime: number;
  totalTime: number;
  ingredients: IngredientSection[];
  prepDirections: string[];
  directions: string[];
  notes: string[];
}
