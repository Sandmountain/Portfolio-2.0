export type ThemeType = typeof defaultTheme;

export const defaultTheme = {
  padding: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  margin: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  // https://coolors.co/ebf8ff-0582ca-da4167-f4d35e-030d12
  palette: {
    primary: "#00A6FB",
    secondary: "#0582CA",
    tertiary: "#F4D35E",
    white: "#EBF8FF",
    black: "#030D12",
    shade: {
      primary: {
        100: "D6F1FF",
        200: "#99DDFF",
        300: "#5CC9FF",
        400: "#00A6FB",
        500: "#0582CA",
        600: "#006494",
        700: "#003554",
        800: "#051923",
      },
    },
  },
};
