import { Text, Link } from '@chakra-ui/react';

function Rules() {
    return (
        <Text textStyle="body" textAlign="center">
            Create a new recipe by copying and editing <Link href='/documents/recipe.docx' textDecoration="underline">this document</Link>.
        </Text>
    )
}

export default Rules;