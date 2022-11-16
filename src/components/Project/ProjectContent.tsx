import React from "react";

import { Project } from "../../types/Project";
import Laptop from "./Laptop/Laptop";

interface Props {
  project?: Project;
  dialog: boolean;
}

const ProjectContent: React.FC<Props> = ({ project, dialog = false }) => {
  return (
    <div
      style={{
        height: dialog ? "800px" : "calc(100vh - 50px)",
        width: "100%",
        background: "#151515",
        display: "flex",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "30%",
          color: "white",
          display: "inline-flex",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "10%",
          zIndex: 100,
        }}>
        <h1 style={{ margin: 0 }}>{project?.title}</h1>
        <p>{project?.shortDescription}</p>
      </div>
      <div style={{ height: "100%", width: "100%" }}>
        <Laptop project={project} />
      </div>
    </div>
  );
};

export default ProjectContent;
