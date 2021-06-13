import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CloseButton,
  Flex,
  HStack,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import React from 'react';
import { RecipeFileInfo, RecipeFileLoadingState, RecipeLoading } from './types';
import RecipeModal from './RecipeModal';

interface LoadingFileCardProps {
  recipeInfo: RecipeLoading;
}

const LoadingFileCard = ({ recipeInfo }: LoadingFileCardProps) => {
  return (
    <Flex align="center" justify="space-between">
      <HStack align="center">
        <Text textStyle="body">{recipeInfo.fileName}</Text>
      </HStack>
      <Spinner />
    </Flex>
  );
};
interface FileCardProps {
  recipeInfo: RecipeFileInfo;
  onClose: Props['removeRecipe'];
  updateRecipe: (recipe: RecipeFileInfo) => void;
}

const FileCard = ({ recipeInfo, onClose, updateRecipe }: FileCardProps) => {
  const { recipe, exists } = recipeInfo;
  const { isOpen, onOpen, onClose: onModalClose, onToggle } = useDisclosure();

  const modal = (
    <RecipeModal
      recipeInfo={recipeInfo}
      isOpen={isOpen}
      onOpen={onOpen}
      onToggle={onToggle}
      onClose={onModalClose}
      updateRecipe={updateRecipe}
    />
  );

  return (
    <>
      {/* We want to force the component to unmount here */}
      {isOpen && modal}
      <Flex
        align="center"
        justify="space-between"
        onClick={() => {
          onOpen();
        }}
        cursor="pointer"
      >
        <HStack align="center">
          <Text textStyle="body">{recipe.title}</Text>
          {exists && (
            <Tooltip
              hasArrow
              label={`Contentful already has an entry titled "${recipe.title}"`}
              placement="top"
              textStyle="body"
              p={3}
            >
              <InfoOutlineIcon />
            </Tooltip>
          )}
        </HStack>
        <CloseButton
          onClick={(e) => {
            onClose(recipeInfo);
            e.stopPropagation();
          }}
        />
      </Flex>
    </>
  );
};

interface Props {
  recipes: RecipeFileLoadingState[];
  removeRecipe: (del: RecipeFileInfo) => void;
  updateRecipe: (recipe: RecipeFileInfo) => void;
}

const FileList = ({ recipes, removeRecipe, updateRecipe }: Props) => {
  const uploaded: RecipeFileInfo[] = recipes.filter(
    (r): r is RecipeFileInfo => !r.loading && !r.exists && r.uploaded
  );
  const toUpload: RecipeFileInfo[] = recipes.filter(
    (r): r is RecipeFileInfo => !r.loading && !r.exists && !r.uploaded
  );
  const errors: RecipeFileInfo[] = recipes.filter(
    (r): r is RecipeFileInfo => !r.loading && r.exists
  );
  const loading: RecipeLoading[] = recipes.filter(
    (r): r is RecipeLoading => r.loading
  );

  return (
    <Accordion allowToggle allowMultiple>
      {loading.length !== 0 && (
        <AccordionItem>
          <AccordionButton textStyle="body">
            <Box flex="1" textAlign="left">
              Loading ({loading.length})
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel>
            {loading.map((recipeInfo, i) => (
              <LoadingFileCard recipeInfo={recipeInfo} key={i} />
            ))}
          </AccordionPanel>
        </AccordionItem>
      )}
      <AccordionItem isDisabled={toUpload.length === 0}>
        <AccordionButton textStyle="body">
          <Box flex="1" textAlign="left">
            To Upload ({toUpload.length})
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {toUpload.map((recipeInfo, i) => (
            <FileCard
              recipeInfo={recipeInfo}
              onClose={removeRecipe}
              key={i}
              updateRecipe={updateRecipe}
            />
          ))}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem isDisabled={uploaded.length === 0}>
        <AccordionButton textStyle="body">
          <Box flex="1" textAlign="left">
            Uploaded ({uploaded.length})
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {uploaded.map((recipeInfo, i) => (
            <FileCard
              recipeInfo={recipeInfo}
              onClose={removeRecipe}
              key={i}
              updateRecipe={updateRecipe}
            />
          ))}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem isDisabled={errors.length === 0}>
        <AccordionButton textStyle="body">
          <Box flex="1" textAlign="left">
            Ignored ({errors.length})
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {errors.map((recipeInfo, i) => (
            <FileCard
              recipeInfo={recipeInfo}
              onClose={removeRecipe}
              key={i}
              updateRecipe={updateRecipe}
            />
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FileList;
