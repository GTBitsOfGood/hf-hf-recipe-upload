// 1. Import `extendTheme`
import { extendTheme } from '@chakra-ui/react';

import '@fontsource/nunito';
import '@fontsource/inconsolata';

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  fonts: {
    heading: `Nunito, sans-serif`,
    body: `Nunito, sans-serif`,
    mono: `Inconsolata, monospace`,
  },
  textStyles: {
    body: {
      fontFamily: `Nunito, sans-serif`,
    },
    mono: {
      fontFamily: `Inconsolata, monospace`,
    },
  },
  components: {
    Textarea: {
      baseStyle: {
        fontFamily: `Inconsolata, monospace`,
      },
    },
  },
});

export default theme;
