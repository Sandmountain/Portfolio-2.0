import { createTheme } from "@mui/material/styles";

import { defaultTheme } from "./theme";

const theme = createTheme({
  palette: {
    primary: {
      main: defaultTheme.palette.primary,
      light: defaultTheme.palette.shade.primary[300],
      dark: defaultTheme.palette.shade.primary[700],
    },
    secondary: {
      main: defaultTheme.palette.secondary,
      light: defaultTheme.palette.shade.secondary[300],
      dark: defaultTheme.palette.shade.secondary[700],
    },
    common: {
      white: defaultTheme.palette.white,
      black: defaultTheme.palette.black,
    },
  },
  spacing: 8,
});

export { theme };
