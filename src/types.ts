export interface Recipe {
  title: string;
  yield: string;
  prepTime?: number;
  totalTime?: number;
  ingredients: string;
  prepDirections?: string;
  directions: string;
  notes?: string;
}

export type Wrapped<T> = {
  [K in keyof T]?: {
    'en-US': string | number;
  };
};
