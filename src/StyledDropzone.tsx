import { Box, Center, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

function StyledDropzone({ setFiles }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((oldFiles) => {
        const allFiles = [...oldFiles];
        allFiles.push(
          ...acceptedFiles.filter(
            (acceptedFile) =>
              oldFiles.find(
                (existingFile) => existingFile.name === acceptedFile.name
              ) == null
          )
        );
        return allFiles;
      });
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.docx' });

  return (
    <Box className="container">
      <Center
        h={32}
        border="1px solid teal"
        borderRadius={6}
        transition="all 0.2s ease-in-out"
        sx={
          isDragActive
            ? {
                bg: 'teal.50',
                color: 'teal.600',
              }
            : {
                bg: 'teal.100',
                color: 'teal.800',
              }
        }
        {...getRootProps()}
        _hover={{ bg: 'teal.50', color: 'teal.600' }}
      >
        <input {...getInputProps()} />
        <Text textStyle="body" textAlign="center">
          Drag 'n' drop recipes here, or click to select recipe files!
          <br></br>
          <i>
            Only <b>*.docx</b> files are accepted.
          </i>
        </Text>
      </Center>
    </Box>
  );
}

export default StyledDropzone;
