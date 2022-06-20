import { useEffect } from "react";

import type { NextPage } from "next";

import Navbar from "../src/components/Navbar/Navbar";
import { initContentful } from "../src/utils/contentful/contentful";

const Home: NextPage = () => {
  useEffect(() => {
    initContentful();
  }, []);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
