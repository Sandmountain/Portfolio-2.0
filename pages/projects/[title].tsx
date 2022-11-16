import React, { Suspense } from "react";

import ProjectContent from "../../src/components/Project/ProjectContent";
import { Project as ProjectType } from "../../src/types/Project";
import { initContentful } from "../../src/utils/contentful/contentful";

interface ProjectPageDetailsProps {
  project: ProjectType;
}

const ProjectPageDetails: React.FC<ProjectPageDetailsProps> = ({ project }) => {
  return (
    <Suspense fallback={null}>
      <ProjectContent project={project} dialog={false} />
    </Suspense>
  );
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
