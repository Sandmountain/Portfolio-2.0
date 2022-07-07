import React from "react";

import Project from "../../src/components/Project/Project";
import { Project as ProjectType } from "../../src/types/Project";
import { initContentful } from "../../src/utils/contentful/contentful";

interface ProjectPageDetailsProps {
  project: ProjectType;
}

const ProjectPageDetails: React.FC<ProjectPageDetailsProps> = ({ project }) => {
  return <Project project={project} />;
};

export default ProjectPageDetails;

export const getStaticPaths = async () => {
  // fetch all the data
  const response = await initContentful();

  const paths = response.items.map(projectResponse => ({
    params: { title: projectResponse.fields.urlName },
  }));

  return {
    paths,
    fallback: false,
  };
};

interface StaticProps {
  params: { title: string };
}
export const getStaticProps = async ({ params }: StaticProps) => {
  const { items } = await initContentful(params.title);

  const project = items[0].fields;

  return {
    props: {
      project,
    },
  };
};
