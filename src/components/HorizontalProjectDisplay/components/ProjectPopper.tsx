import { useEffect, useState } from "react";

import { Box, Paper, Popper, Typography } from "@mui/material";
import { subscribeKey } from "valtio/utils";

import { Project } from "../../../types/Project";
import { state } from "../HorizontalProjectDisplay";

interface ProjectPopperProps {
  projects: Project[];
}

export const ProjectPopper: React.FC<ProjectPopperProps> = ({ projects }) => {
  const [projectDetails, setProjectDetails] = useState<Project | undefined>(undefined);
  const [currentProject, setCurrentProject] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();

  // Subscribe to only changes of the current project
  const unsubscribe = subscribeKey(state, "currentProject", v => setCurrentProject(v?.id ?? ""));

  // const handleClose = () => {
  //   state.currentProject = null;
  // };

  useEffect(() => {
    if (currentProject !== "") {
      const anchor = document.getElementById("canvas-container");
      setAnchorEl(anchor ?? undefined);

      const [project] = projects.filter(project => project.uuid === currentProject);

      setProjectDetails(project);
      setOpen(true);
    } else {
      setOpen(false);
    }

    return () => {
      unsubscribe();
    };
  }, [projects, currentProject, unsubscribe]);

  const id = open ? "simple-popper" : undefined;
  // PaperProps={{ style: { top: 60, left: 0 } }}
  return (
    <>
      {anchorEl && (
        <Popper
          popperOptions={{ strategy: "absolute" }}
          sx={{
            top: "60px !important",
            left: "8px !important",
            width: "400px",
          }}
          id={id}
          open={open}
          disablePortal={false}>
          <Paper
            sx={theme => ({
              padding: theme.spacing(2),
            })}
            elevation={3}>
            <Box component="div">
              <Typography variant="h6"> {projectDetails?.title} </Typography>
            </Box>
            <Typography variant="body1"> {projectDetails?.shortDescription} </Typography>
          </Paper>
        </Popper>
      )}
    </>
  );
};
