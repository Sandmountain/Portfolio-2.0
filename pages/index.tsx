import { useEffect } from "react";

import type { NextPage } from "next";

import { HorizontalProjectDisplay } from "../src/components/HorizontalProjectDisplay/HorizontalProjectDisplay";
import Navbar from "../src/components/Navbar/Navbar";
import VerticalProjectDisplay from "../src/components/VerticalProjectsDisplay/VerticalProjectDisplay";
import { initContentful } from "../src/utils/contentful/contentful";

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const images = [
  // Front
  { position: [0, 0.0, 4], rotation: [0, 0, 0], url: pexel(1103970) },

  // Right
  { position: [2.2, 0, 3], rotation: [0, 0, 0], url: pexel(310452) },
  { position: [4.0, 0, 3], rotation: [0, 0, 0], url: pexel(227675) },
  { position: [5.8, 0, 3], rotation: [0, 0, 0], url: pexel(911738) },

  // Left
  { position: [-2.2, 0, 3], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [-4.0, 0, 3], rotation: [0, 0, 0], url: pexel(327482) },
  { position: [-5.8, 0, 3], rotation: [0, 0, 0], url: pexel(325185) },
];

const Home: NextPage = () => {
  useEffect(() => {
    initContentful();
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <Navbar />
      {/* <VerticalProjectDisplay /> */}
      <div style={{ height: "350px", margin: "0px 20px", border: "4px solid white" }}>
        <HorizontalProjectDisplay images={images} />
      </div>
    </div>
  );
};

export default Home;
