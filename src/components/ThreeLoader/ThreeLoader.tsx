import React, { Suspense } from "react";

interface ThreeLoader {
  children: React.ReactNode;
}

const ThreeLoader: React.FC<ThreeLoader> = ({ children }) => {
  return (
    <>
      <Suspense fallback={<p style={{ color: "white" }}> Loading </p>}>{children}</Suspense>
    </>
  );
};

export default ThreeLoader;
