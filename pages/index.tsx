import { Suspense, useEffect, useState } from "react";

import type { NextPage } from "next";

import getUuid from "uuid-by-string";

import HorizontalProjectDisplay from "../src/components/HorizontalProjectDisplay/HorizontalProjectDisplay";
import { getImages } from "../src/components/HorizontalProjectDisplay/handleProjects";
import Navbar from "../src/components/Navbar/Navbar";
import ThreeLoader from "../src/components/ThreeLoader/ThreeLoader";
import { useProjectStore } from "../src/mobx/projectStore";
import { Project, ProjectImageType } from "../src/types/Project";
import { initContentful } from "../src/utils/contentful/contentful";

const Home: NextPage<{ projects: Project[]; projectImages: ProjectImageType[] }> = ({ projects, projectImages }) => {
  const projectStore = useProjectStore();

  useEffect(() => {
    // Set projects in the store
    projectStore.setProjects(projects);
  }, [projectStore, projects]);

  return (
    <div style={{ height: "100%" }}>
      <Navbar />
      <ThreeLoader>
        <div style={{ height: "calc(100vh - 50px)", background: "black", color: "white" }}>
          <HorizontalProjectDisplay images={projectImages} projects={projects} />
        </div>
      </ThreeLoader>
    </div>
  );
};

export async function getStaticProps() {
  const response = await initContentful();

  const projects = response.items.map(projectResponse => ({
    ...projectResponse.fields,
    uuid: getUuid(projectResponse.fields.title),
  }));

  const projectImages = getImages(projects);

  return {
    props: {
      projects,
      projectImages,
    },
  };
}

export default Home;
