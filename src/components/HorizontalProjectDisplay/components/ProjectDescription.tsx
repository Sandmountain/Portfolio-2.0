import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { parse } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Dialog, IconButton, Paper, Popper, Theme, Typography, useTheme } from "@mui/material";

import {
  ContentfulLanguageType,
  ProjectImageType,
  ProjectStatusType,
  Project as ProjectType,
} from "../../../types/Project";
import LanguageIcon from "../../LanguageIcon/LanguageIcon";
import Project from "../../Project/Project";

interface ProjectDescriptionProps {
  projects: ProjectType[];
  currentProject: ProjectImageType | undefined;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ projects, currentProject }) => {
  const [projectDetails, setProjectDetails] = useState<Project | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme<Theme>();
  const router = useRouter();

  useEffect(() => {
    if (currentProject) {
      const [project] = projects.filter(project => project.uuid === currentProject.id);

      setProjectDetails(project);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [projects, currentProject]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onReadMore = () => {
    // Route to https://domain.com/?project=project-name without refreshing to be able to get a shareable url
    router.push(`?project=${projectDetails?.title.toLocaleLowerCase().replaceAll(" ", "-")}`, undefined, {
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

  const renderLogos = (languages?: ContentfulLanguageType[]) => {
    if (languages) {
      return languages.map((language, key) => <LanguageIcon key={key} language={language} size="small" />);
    }
  };

  return (
    <>
      {open && (
        <Box
          component="div"
          sx={{
            position: "absolute",
            top: theme.spacing(1),
            left: theme.spacing(1),
            width: "400px",
          }}>
          <Paper
            sx={theme => ({
              padding: theme.spacing(2),
            })}
            elevation={3}>
            <>
              <Box component="div" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6"> {projectDetails?.title} </Typography>
                <IconButton size={"small"}>
                  <FontAwesomeIcon icon={["fab", "github"]} />
                </IconButton>
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
                <>
                  <Box component="div" sx={{ display: "flex", gap: 2 }}>
                    {renderLogos(projectDetails?.languages)}
                  </Box>
                  <Box component="div" sx={{ display: "flex", gap: theme.spacing(1), alignSelf: "end" }}>
                    {projectDetails?.demoUrl && (
                      <IconButton size="small">
                        <FontAwesomeIcon
                          color={theme.palette.primary.main}
                          icon={"arrow-up-right-from-square"}></FontAwesomeIcon>
                      </IconButton>
                    )}
                    <Button variant="contained" size="small" onClick={onReadMore}>
                      <Typography variant="button" sx={{ color: theme.palette.common.white }}>
                        Read More
                      </Typography>
                    </Button>
                  </Box>
                </>
              </Box>
            </>
          </Paper>
        </Box>
      )}
      <Dialog fullWidth={true} maxWidth="lg" open={openDialog} onClose={handleCloseDialog}>
        <Project project={projectDetails} />
      </Dialog>
    </>
  );
};
