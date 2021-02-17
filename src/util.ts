import { Recipe } from './types';
import { unescape } from 'html-escaper';
import parse from 'parse-duration';
import { compareTwoStrings } from 'string-similarity';

function parseRecipe(rawText: string) {
  const root = rawText.replace(/<\/?[^>]+(>|$)/g, '\n');

  let lines = root.split('\n');

  lines = lines.filter((x) => x.length > 1).map((x) => unescape(x));
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

  const titleIdx = 0; // probably

  const breakpoints = [
    ingredientIdx,
    preDirectionsIdx,
    directionsIdx,
    notesIdx,
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

  console.log(breakpoints);
  const ingredientsLines = sliceFrom(ingredientIdx);
  const notesLines = sliceFrom(notesIdx);
  const directionsLines = sliceFrom(directionsIdx);
  const preDirectionsLines = sliceFrom(preDirectionsIdx);

  const yieldLines = sliceFrom(yieldIdx);
  const prepTimeLines = sliceFrom(prepTimeIdx);
  const totalTimeLines = sliceFrom(totalTimeIdx);
  const titleLines = sliceFrom(titleIdx);

  // console.log(ingredientsToString(ingredientsLines));
  // console.log(yieldToString(yieldLines));
  // console.log(timeToMinutes(prepTimeLines));
  // console.log(timeToMinutes(totalTimeLines));

  const recipe: Recipe = {
    title: titleLines[0],
    ingredients: ingredientsToString(ingredientsLines),
    prepTime: timeToMinutes(prepTimeLines),
    totalTime: timeToMinutes(totalTimeLines),
    yield: yieldToString(yieldLines),
    prepDirections: stepsToString(preDirectionsLines),
    notes: stepsToString(notesLines),
    directions: stepsToString(directionsLines) ?? '',
  };
  console.log(recipe);
  // uploadRecipe(recipe);

  return recipe;
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
    let splitOnTab = line.split(/\t+/);
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
