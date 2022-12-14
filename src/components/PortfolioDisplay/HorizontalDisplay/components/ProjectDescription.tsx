import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { GitHub } from "@mui/icons-material";
import { Box, Button, Dialog, IconButton, Paper, Theme, Typography, useTheme } from "@mui/material";

import { ProjectStatusType, Project as ProjectType } from "../../../../types/Project";
import { externalResource } from "../../../../utils/url-helpers";
import ProjectContent from "../../ProjectDialog/ProjectContent";
import LanguageLogos from "../../components/LanguageLogos/LanguageLogos";
import ResourceLogos from "../../components/ResourceLogos/ResourceLogos";

interface ProjectDescriptionProps {
  projects: ProjectType[];
  projectId: string | undefined;
  dialog: boolean;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ projects, projectId, dialog }) => {
  const [projectDetails, setProjectDetails] = useState<ProjectType | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme<Theme>();
  const router = useRouter();

  useEffect(() => {
    if (projectId) {
      const [project] = projects.filter(project => project.uuid === projectId);

      setProjectDetails(project);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [projects, projectId]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.push(`/portfolio`, undefined, {
      shallow: true,
    });
  };

  const onReadMore = () => {
    // Route to https://domain.com/?project=project-name without refreshing to be able to get a shareable url
    router.push(`?name=${projectDetails?.title.toLocaleLowerCase().replaceAll(" ", "-")}`, undefined, {
      shallow: true,
    });

    // open dialog
    setOpenDialog(open);
  };

  const renderStatus = (status?: ProjectStatusType) => {
    let textColor: string;
    switch (status?.toLocaleLowerCase()) {
      case "discontinued":
        textColor = theme.palette.error.main;
        break;
      case "ongoing":
        textColor = theme.palette.warning.main;
        break;
      case "finished":
        textColor = theme.palette.success.main;
        break;
      default:
        textColor = theme.palette.success.main;
        break;
    }

    return (
      <Typography component="div" color={textColor} variant="caption">
        {status}
      </Typography>
    );
  };

  return (
    <>
      {open && (
        <Paper component="div" sx={{ height: "100%", width: "100%", position: "relative" }}>
          <Box component="div" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6"> {projectDetails?.title} </Typography>
            {projectDetails?.githubUrl && (
              <IconButton size={"small"} onClick={() => externalResource(projectDetails.githubUrl)}>
                <GitHub />
              </IconButton>
            )}
          </Box>
          <Box component="div" sx={{ flexDirection: "row" }}>
            <Typography variant="caption"> Status: </Typography>
            {renderStatus(projectDetails?.status)}
          </Box>
          <Box component="div" sx={{ margin: `${theme.spacing(2)} 0` }}>
            <Typography variant="body1"> {projectDetails?.shortDescription} </Typography>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <LanguageLogos languages={projectDetails?.languages} dialog={dialog} />
            <Box component="div" sx={{ display: "flex", gap: theme.spacing(1), alignSelf: "end" }}>
              <ResourceLogos project={projectDetails} overlay />
              <Button variant="contained" size="small" onClick={onReadMore}>
                <Typography variant="button" sx={{ color: theme.palette.common.white }}>
                  Read More
                </Typography>
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      <Dialog fullWidth maxWidth={"xl"} open={openDialog} onClose={handleCloseDialog}>
        <ProjectContent project={projectDetails} projects={projects} dialog />
      </Dialog>
    </>
  );
};
