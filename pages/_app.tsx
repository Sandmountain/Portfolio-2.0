import type { AppProps } from "next/app";

import { ThemeProvider } from "@mui/material/styles";

import { ProjectStore, ProjectStoreProvider } from "../src/mobx/projectStore";
import { theme } from "../src/theme/mui-theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const projectStore = new ProjectStore();

  return (
    <ThemeProvider theme={theme}>
      <ProjectStoreProvider store={projectStore}>
        <Component {...pageProps} />
      </ProjectStoreProvider>
    </ThemeProvider>
  );
}

export default MyApp;
