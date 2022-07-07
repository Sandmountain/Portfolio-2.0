import React from "react";

import Image from "next/image";

import { Box } from "@mui/material";

import { Project } from "../../src/types/Project";
import { initContentful } from "../../src/utils/contentful/contentful";

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <Box component="div" sx={{ display: "flex", flexWrap: "wrap" }}>
      {projects.map((project, idx) => {
        return (
          <Box key={idx} component="div" sx={{ height: 172, width: 300, position: "relative" }}>
            <Image
              key={project.title}
              src={`http:${project.thumbnail.fields.file.url}`}
              objectFit="contain"
              layout="fill"
              alt={project.title}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectsPage;

export async function getStaticProps() {
  const response = await initContentful();

  const projects = response.items.map(projectResponse => ({
    ...projectResponse.fields,
  }));

  return {
    props: {
      projects,
    },
  };
}
