import React, { useCallback, useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { parseRecipe } from './parseRecipe';
import { getMatchingRecipe, uploadRecipe } from './contentful';
import Title from './Title';
import StyledDropzone from './StyledDropzone';
import { usePrevious } from './util';
import { RecipeFileInfo, RecipeFileLoadingState } from './types';
import { Box, Button, Container, Stack } from '@chakra-ui/react';
import FileList from './FileList';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [recipes, setRecipes] = useState<RecipeFileLoadingState[]>([]);
  const [isUploading, setUploading] = useState(false);

  const prevFiles = usePrevious(files);

  const parseFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadstart = () => {
        setRecipes((oldRecipes) => {
          return [
            ...oldRecipes,
            {
              fileName: file.name,
              loading: true,
            },
          ];
        });
      };

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
              ...oldRecipes.filter((r) => r.fileName !== file.name),
              {
                recipe,
                exists: matching != null,
                fileName: file.name,
                loading: false,
              },
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
        (recipeInfo) =>
          !recipeInfo.loading && recipeInfo.recipe.title !== del.recipe.title
      );
    });
    setFiles((oldFiles) => {
      return oldFiles.filter((file) => file.name !== del.fileName);
    });
  };

  const updateRecipe = (recipe: RecipeFileInfo) => {
    setRecipes((oldRecipes) => [
      ...oldRecipes.filter(
        (recipeInfo) =>
          !recipeInfo.loading && recipeInfo.recipe.title !== recipe.recipe.title
      ),
      recipe,
    ]);
  };

  const uploadRecipes = async () => {
    setUploading(true);
    for (let info of recipes) {
      if (info.loading || info.exists) {
        continue;
      }
      await uploadRecipe(info.recipe);
    }
    setUploading(false);
  };

  useEffect(() => {
    const newFiles = files.filter((file) => !prevFiles?.includes(file));

    // we only need to parse new files
    parseFiles(newFiles);
  }, [files, parseFiles, prevFiles]);

  const uploadableCount = recipes.filter((r) => !r.loading && !r.exists).length;

  return (
    <Container>
      <Stack spacing={8}>
        <Box mt={20}>
          <Title />
        </Box>
        <Box mt={32}>
          <StyledDropzone setFiles={setFiles} />
        </Box>
        <FileList
          recipes={recipes}
          removeRecipe={removeRecipe}
          updateRecipe={updateRecipe}
        />
        <Button
          onClick={() => uploadRecipes()}
          disabled={uploadableCount === 0}
          isLoading={isUploading}
        >
          Upload{uploadableCount > 0 && ` (${uploadableCount})`}
        </Button>
      </Stack>
    </Container>
  );
}

export default App;
