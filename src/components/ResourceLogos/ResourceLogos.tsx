import React, { ReactNode } from "react";

import { GitHub, OpenInBrowser, YouTube } from "@mui/icons-material/";
import { Icon, IconButton } from "@mui/material";

import { Project } from "../../types/Project";
import { externalResource } from "../../utils/url-helpers";

interface ResourceLogosProps {
  project?: Project;
  overlay?: boolean;
}
const ResourceLogos: React.FC<ResourceLogosProps> = ({ project, overlay = false }) => {
  const getResource = () => {
    if (!project) return <></>;

    const resources: ReactNode[] = [];

    if (project.demoUrl) {
      resources.push(
        <IconButton key={project.demoUrl} size="small" onClick={() => externalResource(project.demoUrl)}>
          <OpenInBrowser />
        </IconButton>,
      );
    }

    if (project.screencast) {
      // TODO: lägg till player
      resources.push(
        <IconButton key={project.screencast} size="small" onClick={() => externalResource(project.screencast)}>
          <YouTube />
        </IconButton>,
      );
    }

    if (project.githubUrl) {
      resources.push(
        <IconButton key={project.githubUrl} size="small" onClick={() => externalResource(project.githubUrl)}>
          <GitHub />
        </IconButton>,
      );
    }

    if (project.report && !overlay) {
      resources.push(
        <IconButton key={project.report} size="small" onClick={() => externalResource(project.report)}>
          <Icon>description</Icon>
        </IconButton>,
      );
    }

    return resources;
  };

  return <>{getResource()}</>;
};

export default ResourceLogos;
