import * as contentful from 'contentful-management';
import { Environment } from 'contentful-management/dist/typings/export-types';
import { Recipe } from './types';

const client = contentful.createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN ?? '',
});

async function run() {
  // This API call will request a space with the specified ID
  const environment = await genEnvironment();

  const recipeType = await environment.getContentType('recipe');
  console.log(recipeType);

  // Now that we have a space, we can get entries from that space
  const entries = await environment.getEntries({ content_type: 'recipe' });
  console.log(entries.items[1].toPlainObject());

  //   const entry = await environment.createEntry('recipe', newRecipeData);
  //   console.log(entry);
}

run();

async function genEnvironment(): Promise<Environment> {
  const space = await client.getSpace(
    process.env.REACT_APP_CONTENTFUL_SPACE_ID ?? ''
  );

  const environment = await space.getEnvironment('master');

  return environment;
}

const locale = 'en-US';

const uploadRecipe = async (recipe: Recipe) => {
  const environment = await genEnvironment();

  const newRecipeData = {
    fields: {
      title: {
        [locale]: recipe.title,
      },
    },
  };

  const entry = await environment.createEntry('recipe', newRecipeData);
  console.log(entry);
};

export { uploadRecipe };
