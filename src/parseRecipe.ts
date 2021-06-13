import { Recipe } from './types';
import { unescape } from 'html-escaper';
import parse from 'parse-duration';
import { compareTwoStrings } from 'string-similarity';

/**
 * README: Many of the regular expressions in the `parseRecipe` function
 * may make you scream just looking at them. They were developed with love
 * using actual recipe files to catch as many edge cases as humanly possible.
 * 
 * So before you throw up your hands, plug the recipes into a website
 * like https://regex101.com/ (<-- very helpful!) and take some deep breaths.
 * 
 * You've got this.
 * 
 * <3 Max Karpawich
 */

function parseRecipe(rawText: string) {
  const root = rawText
    .replace(/<\/?(b|strong|i)(>|$)/g, '') // removes text styling tags
    .replace(/<\/?[^>]+(>|$)/g, '\n'); // replaces all other tags with newlines

  let lines = root.split('\n');

  lines = lines.filter((x) => x.length > 1).map((x) => unescape(x));
  // console.log(lines);

  const ingredientIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('ingredients')
  );

  const preDirectionsIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('pre-class') ||
    line.toLowerCase().includes('before class')
  );

  const directionsIdx = lines.findIndex(
    (line) =>
      (
        line.toLowerCase().trim().replace(/[^a-z\s]/g, '') === ('directions') ||
        line.toLowerCase().trim().replace(/[^a-z\s]/g, '') === ('method of preparation')
      )
  );

  const notesIdx = lines.findIndex(
    (line) => line.length < 8 && line.toLowerCase().includes('notes')
  );

  const yieldIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('yield')
  );

  const prepTimeIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('prep time')
  );

  const totalTimeIdx = lines.findIndex((line) =>
    line.toLowerCase().includes('total time')
  );

  const specialDietInfoIdx = lines.findIndex((line) =>
  line.toLowerCase().includes('special diet info')
);

  const titleIdx = 0; // probably

  const breakpoints = [
    ingredientIdx,
    preDirectionsIdx,
    directionsIdx,
    notesIdx,
    specialDietInfoIdx,
    yieldIdx,
    prepTimeIdx,
    totalTimeIdx,
    titleIdx,
  ]
    .filter((x) => x !== -1)
    .sort((a, b) => a - b);

  const breakpointAfter = (after: number) => breakpoints.find((x) => x > after);
  const sliceFrom = (from: number) =>
    from !== -1 ? lines.slice(from, breakpointAfter(from)) : [];

  // console.log(breakpoints);
  const ingredientsLines = sliceFrom(ingredientIdx);
  const notesLines = sliceFrom(notesIdx);
  const directionsLines = sliceFrom(directionsIdx);
  const preDirectionsLines = sliceFrom(preDirectionsIdx);
  const specialDietInfoLines = sliceFrom(specialDietInfoIdx);

  const yieldLines = sliceFrom(yieldIdx);
  const prepTimeLines = sliceFrom(prepTimeIdx);
  const totalTimeLines = sliceFrom(totalTimeIdx);
  const titleLines = sliceFrom(titleIdx);

  // console.log(ingredientsToString(ingredientsLines));
  // console.log(yieldToString(yieldLines));
  // console.log(timeToMinutes(prepTimeLines));
  // console.log(timeToMinutes(totalTimeLines));

  const errors = [];

  let title;
  let ingredients;
  let prepTime;
  let totalTime;
  let recipeYield;
  let prepDirections;
  let notes;
  let directions;
  let specialDietInformation;
  
  try {
    title = titleLines[0];
  } catch (_) {
    title = '';
    errors.push('Title');
  }

  try {
    ingredients = ingredientsToString(ingredientsLines);
  } catch (_) {
    ingredients = '';
    errors.push('Ingredients');
  }

  try {
    prepTime = timeToMinutes(prepTimeLines);
  } catch (_) {
    errors.push('Prep time');
  }

  try {
    totalTime = timeToMinutes(totalTimeLines);
  } catch (_) {
    errors.push('Total time');
  }

  try {
    recipeYield = yieldToString(yieldLines);
  } catch (_) {
    recipeYield = '';
    errors.push('Yield');
  }

  try {
    prepDirections = stepsToString(preDirectionsLines);
  } catch (_) {
    errors.push('Pre-class prep');
  }

  try {
    notes = stepsToString(notesLines);
  } catch (_) {
    errors.push('Notes');
  }

  try {
    directions = stepsToString(directionsLines) ?? '';
  } catch (_) {
    directions = '';
    errors.push('Directions');
  }

  try {
    specialDietInformation = specialDietLinesToString(specialDietInfoLines);
  } catch (_) {
    specialDietInformation = '';
    errors.push('special diet info');
  }

  const recipe: Recipe = {
    title,
    ingredients,
    prepTime,
    totalTime,
    yield: recipeYield,
    prepDirections,
    notes,
    directions,
    specialDietInformation,
  }

  return { recipe, errors };
}

function stepsToString(lines: string[]) {
  if (lines.length === 0) {
    return undefined;
  }
  return lines
    .slice(1)
    .map((l) => `- ${l}`)
    .join('\n');
}

function yieldToString(yieldLines: string[]) {
  const joined = yieldLines.join(' ');
  const [, out] = joined.split(/[yY]ield:?/);
  return out.trim();
}

function timeToMinutes(timeLines: string[]) {
  const joined = timeLines.join(' ');
  const [, out] = joined.split(/[tT]ime:?/);
  const asMinutes = parse(out, 'm');
  if (asMinutes == null) return undefined;
  return +asMinutes;
}

function ingredientsToString(ingredientLines: string[]) {
  const outlines: string[] = [];

  ingredientLines.forEach((line) => {
    if (line.indexOf('\t') === -1) return; // ignore sub-headings

    line = line.trim();

    if (compareTwoStrings(line, 'ingredients') >= 0.8) {
      return;
    }

    let note = '';
    if (line.match(/\)$/) != null) {
      const leftParenIdx = line.lastIndexOf('(');
      note = line.slice(leftParenIdx).replace('(', '').replace(')', '');
      line = line.slice(undefined, leftParenIdx);
    }

    let name = '';
    let amount = '';
    let splitOnTab = line.split(/\t+\s*\t*/);
    if (splitOnTab.length === 1) {
      name = splitOnTab[0].trim();
    } else {
      [amount, name] = splitOnTab;
      amount = amount.trim();
      name = name.trim();
    }

    outlines.push(`- ${name}`);

    if (amount.length === 0) {
      // do nothing
      if (note.length > 0) {
        outlines.push(`  -`, `  - ${note}`);
      }
    } else {
      outlines.push(`  - ${amount}`);
      if (note.length > 0) {
        outlines.push(`  - ${note}`);
      }
    }
  });

  return outlines.join('\n');
}

function specialDietLinesToString(specialDietLines: string[]) {
  if (specialDietLines.length === 0) {
    return '';
  }
  return specialDietLines
    .slice(1)
    .join(' ');
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
