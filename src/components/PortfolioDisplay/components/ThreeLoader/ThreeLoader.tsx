import React, { Suspense } from "react";

import { CircularProgress } from "@mui/material";

interface ThreeLoader {
  children: React.ReactNode;
}

const ThreeLoader: React.FC<ThreeLoader> = ({ children }) => {
  return (
    <>
      <Suspense
        fallback={
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 50px)" }}>
            <p style={{ color: "white" }}>
              <CircularProgress />
            </p>
          </div>
        }>
        {children}
      </Suspense>
    </>
  );
};

export default ThreeLoader;
