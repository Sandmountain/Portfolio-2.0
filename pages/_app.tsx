import type { AppProps } from "next/app";

// Importing icons to be able to use as icon="string"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ThemeProvider } from "@mui/material/styles";

import { ProjectStore, ProjectStoreProvider } from "../src/mobx/projectStore";
import { theme } from "../src/theme/mui-theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const projectStore = new ProjectStore();
  library.add(fab, fas);

  return (
    <ThemeProvider theme={theme}>
      <ProjectStoreProvider store={projectStore}>
        <Component {...pageProps} />
      </ProjectStoreProvider>
    </ThemeProvider>
  );
}

export default MyApp;
