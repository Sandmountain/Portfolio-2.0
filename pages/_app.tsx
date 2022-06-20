import { ThemeProvider } from "styled-components";

import type { AppProps } from "next/app";

import { defaultTheme } from "../src/theme/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
