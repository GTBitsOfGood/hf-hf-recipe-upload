// 1. Import `extendTheme`
import { extendTheme } from '@chakra-ui/react';

import '@fontsource/nunito';
import '@fontsource/inconsolata';

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  textStyles: {
    body: {
      fontFamily: `Nunito, sans-serif`,
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: `Nunito, sans-serif`,
      },
    },
  },
});

export default theme;
