import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CloseButton,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import { RecipeFileInfo } from './types';

interface FileCardProps {
  recipeInfo: RecipeFileInfo;
  onClose: Props['removeRecipe'];
}

const FileCard = ({ recipeInfo, onClose }: FileCardProps) => {
  const { recipe } = recipeInfo;
  return (
    <Flex align="center" justify="space-between">
      <Flex align="center">
        <p>{recipe.title}</p>
      </Flex>
      <CloseButton onClick={() => onClose(recipeInfo)} />
    </Flex>
  );
};

interface Props {
  recipes: RecipeFileInfo[];
  removeRecipe: (del: RecipeFileInfo) => void;
}

const FileList = ({ recipes, removeRecipe }: Props) => {
  const toUpload = recipes.filter((r) => !r.exists);
  const errors = recipes.filter((r) => r.exists);

  return (
    <Accordion allowToggle allowMultiple defaultIndex={[0]}>
      <AccordionItem isDisabled={toUpload.length === 0}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            To Upload ({toUpload.length})
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {toUpload.map((recipeInfo, i) => (
            <FileCard recipeInfo={recipeInfo} onClose={removeRecipe} key={i} />
          ))}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem isDisabled={errors.length === 0}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Ignored ({errors.length})
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {errors.map((recipeInfo, i) => (
            <FileCard recipeInfo={recipeInfo} onClose={removeRecipe} key={i} />
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FileList;
