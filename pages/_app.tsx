import { ThemeProvider } from "styled-components";

import type { AppProps } from "next/app";

import { ProjectStore, ProjectStoreProvider } from "../src/mobx/projectStore";
import { defaultTheme } from "../src/theme/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const projectStore = new ProjectStore();

  return (
    <ThemeProvider theme={defaultTheme}>
      <ProjectStoreProvider store={projectStore}>
        <Component {...pageProps} />
      </ProjectStoreProvider>
    </ThemeProvider>
  );
}

export default MyApp;
