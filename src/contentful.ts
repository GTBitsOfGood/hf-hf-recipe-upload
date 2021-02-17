import * as contentful from 'contentful-management';
import { Environment } from 'contentful-management/dist/typings/export-types';
import { compareTwoStrings } from 'string-similarity';
import { Recipe, Wrapped } from './types';

const client = contentful.createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN ?? '',
});

async function genEnvironment(): Promise<Environment> {
  const space = await client.getSpace(
    process.env.REACT_APP_CONTENTFUL_SPACE_ID ?? ''
  );

  const environment = await space.getEnvironment('master');

  return environment;
}

const LOCALE = 'en-US';

function wrapLocale(recipe: Recipe): Wrapped<Recipe> {
  const fields: Wrapped<Recipe> = {};

  (Object.keys(recipe) as Array<keyof typeof recipe>).forEach((key) => {
    const val = recipe[key];
    if (val == null) {
      return;
    }
    fields[key] = { [LOCALE]: val };
  });

  return fields;
}

export const uploadRecipe = async (recipe: Recipe) => {
  const environment = await genEnvironment();

  const formattedRecipe = wrapLocale(recipe);

  const entry = await environment.createEntry('recipe', {
    fields: formattedRecipe,
  });

  // await entry.publish();
  console.log(entry);
};

export const getMatchingRecipe = async (recipe: Recipe) => {
  const environment = await genEnvironment();

  const existingRecipes = await environment.getEntries({
    content_type: 'recipe',
  });

  console.log(existingRecipes.items);

  const existing = existingRecipes.items.find(
    (r) => compareTwoStrings(r.fields.title[LOCALE], recipe.title) >= 0.8
  );

  return existing;
};
