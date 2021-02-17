import { Box, Text } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

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

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <Box className="container">
      <Box {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <Text textStyle="body">
          Drag 'n' drop some files here, or click to select files
        </Text>
      </Box>
    </Box>
  );
}

export default StyledDropzone;
