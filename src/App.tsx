import React, { useCallback, useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { parseRecipe } from './parseRecipe';
import { getMatchingRecipe } from './contentful';
import StyledDropzone from './StyledDropzone';
import { usePrevious } from './util';
import { IoAlertCircleOutline, IoClose } from 'react-icons/io5';
import { Recipe } from './types';

interface RecipeFileInfo {
  recipe: Recipe;
  exists: boolean;
  fileName: string;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [recipes, setRecipes] = useState<RecipeFileInfo[]>([]);

  const prevFiles = usePrevious(files);

  const parseFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = (e: ProgressEvent<FileReader>) => {
        if (e.target == null) return;
        const arrayBuffer = e.target.result;

        (async () => {
          const r = await mammoth.convertToHtml({ arrayBuffer });
          const recipe = parseRecipe(r.value);
          const matching = await getMatchingRecipe(recipe);
          if (matching != null) {
            console.log(
              `A Contentful entry already exists for ${recipe.title}`
            );
          }

          setRecipes((oldRecipes) => {
            return [
              ...oldRecipes,
              { recipe, exists: matching != null, fileName: file.name },
            ];
          });
        })();
      };

      console.log(`Parsing ${file.name}...`);

      reader.readAsArrayBuffer(file);
    });
  }, []);

  const removeRecipe = (del: RecipeFileInfo) => {
    setRecipes((oldRecipes) => {
      return oldRecipes.filter(
        ({ recipe }) => recipe.title !== del.recipe.title
      );
    });
    setFiles((oldFiles) => {
      return oldFiles.filter((file) => file.name !== del.fileName);
    });
  };

  useEffect(() => {
    const newFiles = files.filter((file) => !prevFiles?.includes(file));

    // we only need to parse new files
    parseFiles(newFiles);
  }, [files, parseFiles, prevFiles]);

  return (
    <div className="App">
      <StyledDropzone setFiles={setFiles} />
      <button onClick={() => console.log('upload!')}>upload</button>

      {recipes.map((recipeInfo, i) => {
        const { recipe, exists } = recipeInfo;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <p>{recipe.title}</p>
              {exists && (
                <IoAlertCircleOutline style={{ marginLeft: '0.5em' }} />
              )}
            </div>
            <IoClose onClick={() => removeRecipe(recipeInfo)} />
          </div>
        );
      })}
    </div>
  );
}

export default App;
