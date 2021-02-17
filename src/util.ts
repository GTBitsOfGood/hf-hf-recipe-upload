import { htmlToText } from 'html-to-text';
import './contentful';
import { IngredientSection } from './types';

const tagOpts = Object.fromEntries(
  [...Array(6)].map((_, i) => [
    `h${i + 1}`,
    {
      options: {
        uppercase: false,
      },
    },
  ])
);

function parseRecipe(rawText: string) {
  console.log(rawText);
  const root = htmlToText(rawText, {
    tags: tagOpts,
  });

  const lines = root.split('\n').filter((x) => x.length > 0);

  console.log(lines);

  const ingredientIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('ingredients')
  );

  const preDirectionsIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('pre-class')
  );

  const directionsIdx = lines.findIndex(
    (line) =>
      line.toLowerCase().includes('directions') &&
      !line.toLowerCase().includes('pre')
  );

  const yieldIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('yield')
  );

  const ingredientsLines = lines.slice(
    ingredientIdx,
    preDirectionsIdx === -1 ? directionsIdx : preDirectionsIdx
  );

  console.log(ingredientsLines);

  console.log({ ingredientIdx, preDirectionsIdx, directionsIdx, yieldIdx });
}

const units = ['cup', 'ea.', 'to taste', 'tablespoon', 'tbsp', 'clove'];

function parseIngredients(lines: string[]): IngredientSection[] {
  return [];
}

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (res) => {
      if (res.target == null) {
        return;
      }
      resolve(res.target.result);
    };
    reader.onerror = (err) => reject(err);

    reader.readAsText(file);
  });
}

export { parseRecipe, readFile };
