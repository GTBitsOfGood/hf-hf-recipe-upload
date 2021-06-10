import { Box, Heading } from '@chakra-ui/react';

function Title() {
    return (
    <Box>
        <Heading size="md" textAlign="center" textColor="gray">
        Healthy Families Healthy Futures
        </Heading>
        <Heading textAlign="center" mt={2}>
            Recipe Upload Tool
        </Heading>
    </Box>
    );
}

export default Title;