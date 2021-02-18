import React from 'react';
import { Textarea, TextareaProps } from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';

interface Props extends TextareaProps {}

export const AutoResizeTextarea = (props: Props) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  );
};
