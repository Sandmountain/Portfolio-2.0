import type { AppProps } from "next/app";

// Importing icons to be able to use as icon="string"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ThemeProvider } from "@mui/material/styles";

import { ProjectContextProvider } from "../src/components/PortfolioDisplay/ComputersView/context/ProjectContext";
import PageLayout from "../src/layouts/PageLayout";
import { theme } from "../src/theme/mui-theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  library.add(fab, fas);

  return (
    <ThemeProvider theme={theme}>
      <ProjectContextProvider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ProjectContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
