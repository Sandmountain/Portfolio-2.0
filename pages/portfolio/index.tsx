import { useEffect } from "react";

import type { NextPage } from "next";

import getUuid from "uuid-by-string";

import ComputerView from "../../src/components/PortfolioDisplay/ComputersView/ComputerView";
import { useProjectContext } from "../../src/components/PortfolioDisplay/ComputersView/context/ProjectContext";
import { getImages } from "../../src/components/PortfolioDisplay/HorizontalDisplay/helpers/handleProjects";
import { Project, ProjectImageType } from "../../src/types/Project";
import { initContentful } from "../../src/utils/contentful/contentful";

const Home: NextPage<{ projects: Project[]; projectImages: ProjectImageType[] }> = ({ projects, projectImages }) => {
  const { setProjects, setSelectedProject } = useProjectContext();

  useEffect(() => {
    if (projects === undefined && projectImages === undefined) return;
    setProjects(projects);
    setSelectedProject(projects[0]);
  }, [projectImages, projects, setProjects, setSelectedProject]);

  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: "calc(100vh - 50px)", background: "black", color: "white" }}>
        <ComputerView />
      </div>
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
