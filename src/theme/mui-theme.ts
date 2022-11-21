import { createTheme } from "@mui/material/styles";

import { defaultTheme } from "./theme";

const { palette } = createTheme();
const { augmentColor } = palette;

const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    white: createColor("#FFF"),
    text: {},
  },
  spacing: 8,
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
  },
});

const ThemeType = typeof theme;

export { theme, ThemeType };
