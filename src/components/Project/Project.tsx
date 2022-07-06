import React from "react";
import { Project } from "../../types/Project";


import { Box, Typography } from "@mui/material";
import { MDParser } from "../MDParser/MDParser";

interface ProjectProps {
  project: Project;
}

const Project: React.FC<ProjectProps> = ({project}) => {

  console.log(project);



  return (
    <div className="projectLayout-container">
  
      <div className="projectLayout-header">
        <Typography>{project.title}</Typography>
      </div>
      <div className="projectLayout-content">
        <Box component="div">{<MDParser document={project.description}/>}</Box>
        <Box component="div">{<MDParser document={project.development}/>}</Box>
      </div>
      <div className="projectLayout-footer">
        <Typography>hej</Typography>
      </div>
  
    </div>);
};

export default Project;
