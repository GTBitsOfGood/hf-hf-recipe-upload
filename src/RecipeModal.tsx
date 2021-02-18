import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { Recipe, RecipeFileInfo } from './types';

interface Props {
  recipeInfo: RecipeFileInfo;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  updateRecipe: (recipe: RecipeFileInfo) => void;
}

const RecipeModal = ({ recipeInfo, isOpen, onClose, updateRecipe }: Props) => {
  const [recipe, setRecipe] = useState<Recipe>(recipeInfo.recipe);

  const changeField = <K extends keyof Recipe>(field: K, val: Recipe[K]) => {
    setRecipe((oldRecipe) => ({
      ...oldRecipe,
      [field]: val,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{recipe.title}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack>
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title"
                value={recipe.title}
                onChange={(e) => {
                  changeField('title', e.target.value);
                }}
              />
            </FormControl>

            <FormControl id="yield">
              <FormLabel>Yield</FormLabel>
              <Input
                placeholder="Yield"
                value={recipe.yield}
                onChange={(e) => {
                  changeField('yield', e.target.value);
                }}
              />
            </FormControl>

            <FormControl id="prepTime">
              <FormLabel>Prep Time</FormLabel>
              <InputGroup>
                <NumberInput
                  value={recipe.prepTime}
                  flex={1}
                  onChange={(e) => {
                    changeField('prepTime', +e);
                  }}
                >
                  <NumberInputField placeholder="Prep Time" />
                </NumberInput>
                <InputRightAddon children="minutes" />
              </InputGroup>
            </FormControl>

            <FormControl id="totalTime">
              <FormLabel>Total Time</FormLabel>
              <InputGroup>
                <NumberInput
                  value={recipe.totalTime}
                  flex={1}
                  onChange={(e) => {
                    changeField('totalTime', +e);
                  }}
                >
                  <NumberInputField placeholder="Total Time" />
                </NumberInput>
                <InputRightAddon children="minutes" />
              </InputGroup>
            </FormControl>

            <FormControl id="ingredients">
              <FormLabel>Ingredients</FormLabel>
              <AutoResizeTextarea
                placeholder="Ingredients"
                value={recipe.ingredients}
                height={20}
                onChange={(e) => {
                  changeField('ingredients', e.target.value);
                }}
              />
            </FormControl>

            <FormControl id="prepDirections">
              <FormLabel>Pre-Class Directions</FormLabel>
              <AutoResizeTextarea
                placeholder="Pre-Class Directions"
                value={recipe.prepDirections}
                height={20}
                onChange={(e) => {
                  changeField('prepDirections', e.target.value);
                }}
              />
            </FormControl>

            <FormControl id="directions">
              <FormLabel>Directions</FormLabel>
              <AutoResizeTextarea
                placeholder="Directions"
                value={recipe.directions}
                height={20}
                onChange={(e) => {
                  changeField('directions', e.target.value);
                }}
              />
            </FormControl>

            <FormControl id="notes">
              <FormLabel>Notes</FormLabel>
              <AutoResizeTextarea
                placeholder="Notes"
                value={recipe.notes}
                height={20}
                onChange={(e) => {
                  changeField('notes', e.target.value);
                }}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              updateRecipe({ ...recipeInfo, recipe });
            }}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RecipeModal;
