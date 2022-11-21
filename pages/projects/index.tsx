import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Box } from "@mui/material";

import { Project } from "../../src/types/Project";
import { initContentful } from "../../src/utils/contentful/contentful";

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <>
      <Box component="div" className="project-grid">
        {projects.map((project, idx) => {
          return (
            <Link key={project.title} href={`/projects/${project.title.toLocaleLowerCase().replaceAll(" ", "-")}`}>
              <Box component="div" sx={{ height: 172, width: 300, position: "relative" }} className="project-card">
                <Image
                  className="zoomContent-image"
                  key={project.title}
                  src={`http:${project.thumbnail.fields.file.url}`}
                  objectFit="cover"
                  layout="fill"
                  alt={project.title}
                />
              </Box>
            </Link>
          );
        })}
      </Box>
    </>
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
