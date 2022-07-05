import { createTheme } from "@mui/material/styles";

import { defaultTheme } from "./theme";

const theme = createTheme({
  palette: {
    primary: {
      main: defaultTheme.palette.primary,
      light: defaultTheme.palette.shade.primary[300],
      dark: defaultTheme.palette.shade.primary[500],
    },
    secondary: {
      main: defaultTheme.palette.secondary,
      light: defaultTheme.palette.shade.secondary[300],
      dark: defaultTheme.palette.shade.secondary[500],
    },
    common: {
      white: defaultTheme.palette.white,
      black: defaultTheme.palette.black,
    },
    text: {},
  },

  spacing: 8,
});

const ThemeType = typeof theme;

export { theme, ThemeType };
