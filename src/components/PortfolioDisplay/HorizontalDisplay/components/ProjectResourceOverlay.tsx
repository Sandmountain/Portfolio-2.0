import { useEffect, useState } from "react";

import { Box, Button, Divider, Paper, Theme, useTheme } from "@mui/material";

import { Project as ProjectType } from "../../../../types/Project";
import { state } from "../../PortfolioView";
import LanguageLogos from "../../components/LanguageLogos/LanguageLogos";
import ResourceLogos from "../../components/ResourceLogos/ResourceLogos";

interface ProjectOverlayProps {
  projects: ProjectType[];
  projectId: string | undefined;
  dialog: boolean;
}

export const ProjectResourceOverlay: React.FC<ProjectOverlayProps> = ({ projects, projectId, dialog }) => {
  const [projectDetails, setProjectDetails] = useState<ProjectType | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const theme = useTheme<Theme>();

  useEffect(() => {
    if (projectId) {
      const [project] = projects.filter(project => project.uuid === projectId);

      setProjectDetails(project);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [projects, projectId]);

  return (
    <>
      {open && (
        <Box
          component="div"
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            flexDirection: "column",
            p: theme.spacing(1),
            background: "rgba(0,0,0,.4)",
            borderBottomRightRadius: 12,
          }}>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing(1),
            }}>
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap:
                  projectDetails?.githubUrl || projectDetails?.screencast || projectDetails?.demoUrl
                    ? theme.spacing(1)
                    : 0,
                p: projectDetails?.githubUrl || projectDetails?.screencast || projectDetails?.demoUrl ? 0 : "5px",
                px: theme.spacing(1),
              }}>
              <LanguageLogos languages={projectDetails?.languages} dialog={dialog} />

              {(projectDetails?.githubUrl || projectDetails?.screencast || projectDetails?.demoUrl) && (
                <Divider flexItem variant="middle" orientation="vertical" />
              )}
              <Box component="div">
                <ResourceLogos project={projectDetails} overlay />
              </Box>
            </Paper>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", gap: theme.spacing(1) }}
              className="clickable">
              <Button
                variant="contained"
                className="clickable"
                size="small"
                onClick={() => (state.isProjectDialogOpen = true)}>
                Read More
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
