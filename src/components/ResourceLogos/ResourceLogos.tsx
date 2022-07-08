import React, { ReactNode } from "react";

import { Project } from "../../types/Project";
import { externalResource } from "../../utils/url-helpers";

import { GitHub, OpenInBrowser, YouTube } from "@mui/icons-material/";
import { Icon, IconButton } from "@mui/material";

interface ResourceLogosProps {
  project: Project;
}
const ResourceLogos: React.FC<ResourceLogosProps> = ({ project }) => {
  const getResource = () => {
    const resources: ReactNode[] = [];

    if (project.demoUrl) {
      resources.push(
        <IconButton size="small" onClick={() => externalResource(project.demoUrl)}>
          <OpenInBrowser />
        </IconButton>,
      );
    }

    if (project.screencast) {
      // TODO: lägg till player
      resources.push(
        <IconButton size="small" onClick={() => externalResource(project.screencast)}>
          <YouTube />
        </IconButton>,
      );
    }

    if (project.githubUrl) {
      resources.push(
        <IconButton size="small" onClick={() => externalResource(project.githubUrl)}>
          <GitHub />
        </IconButton>,
      );
    }

    if (project.report) {
      resources.push(
        <IconButton size="small" onClick={() => externalResource(project.report)}>
          <Icon>description</Icon>
        </IconButton>,
      );
    }

    return resources;
  };

  getResource();

  return <div>{getResource()} </div>;
};

export default ResourceLogos;
