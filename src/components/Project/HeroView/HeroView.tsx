import React from "react";

import {
  ArrowLeft,
  ArrowRight,
  Article,
  DocumentScannerRounded,
  OpenInBrowser,
  PictureAsPdf,
  YouTube,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, Divider, IconButton, Paper, Typography } from "@mui/material";
import { useSnapshot } from "valtio";

import { theme } from "../../../theme/mui-theme";
import { Project, ProjectImageType } from "../../../types/Project";
import { externalResource } from "../../../utils/url-helpers";
import { state } from "../../HorizontalProjectDisplay/HorizontalProjectDisplay";
import LanguageLogos from "../../LanguageLogos/LanguageLogos";
import Laptop from "./Laptop/Laptop";

interface Props {
  project: Project;
  isInView: boolean;
  dialog: boolean;
}

const HeroView: React.FC<Props> = ({ project, isInView, dialog }) => {
  const snap = useSnapshot(state);

  const changeProject = (back: boolean) => {
    // convert from proxy to js-object
    const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

    const idx = projects.findIndex(proj => proj.id === snap.currentProject?.id);

    if (idx === -1) {
      return;
    }

    const newIndex = idx < projects.length - 1 ? idx + (back ? -1 : 1) : 0;

    const newProject = state.allProjects?.[newIndex];

    state.currentProject = newProject ?? null;
  };

  const changeProjectToIndex = (index: number): void => {
    const newProject = state.allProjects?.[index];

    state.currentProject = newProject ?? null;
  };

  return (
    <>
      <Box
        component="div"
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}>
        <Box component="div" sx={{ position: "absolute", display: "flex", gap: 1, zIndex: 121, alignItems: "center" }}>
          <IconButton size="small" onClick={() => changeProject(true)} color="white" sx={{ ml: 1 }}>
            <ArrowLeft />
          </IconButton>
          {snap.allProjects?.map((proj, i) => (
            <Box
              onClick={() => changeProjectToIndex(i)}
              key={proj.title}
              component="div"
              sx={{
                cursor: "pointer",
                height: "8px",
                width: "8px",
                borderRadius: 8,
                backgroundColor:
                  snap.currentProject?.title === proj.title ? theme.palette.primary.main : "rgba(0,0,0,0.2)",
              }}></Box>
          ))}
          <IconButton size="small" onClick={() => changeProject(false)} color="white" sx={{ mr: 1 }}>
            <ArrowRight />
          </IconButton>
        </Box>
      </Box>
      <Box
        component="div"
        style={{
          position: "absolute",
          height: "100%",
          width: "30%",
          color: "white",
          display: "inline-flex",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "10%",
          zIndex: 120,
        }}>
        <h1 style={{ margin: 0 }}>{project.title}</h1>
        <p>{project.shortDescription}</p>
      </Box>
      <Box
        component="div"
        sx={{
          position: "absolute",
          width: "100%",
          color: "white",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          bottom: 12,
          padding: "0px 12px",
          zIndex: 100,
        }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Box component="div" sx={{ flex: 1 }}></Box>
          <Box
            component="div"
            className={`${isInView ? "show-on-delay" : "hidden"}`}
            sx={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="overline" style={{ lineHeight: 1, color: "white" }}>
              Swipe down
            </Typography>
            <div className="bouncing-arrow">
              <KeyboardArrowDownIcon viewBox="0 0 20 20" htmlColor="#FFF" />
            </div>
          </Box>
          <Box component="div" sx={{ display: "flex", justifyContent: "end", flex: 1 }}>
            <Paper sx={{ display: "inline-flex", gap: theme.spacing(2), padding: `${theme.spacing(1)}` }}>
              <LanguageLogos languages={project?.languages} dialog />

              <Box component="div" sx={{ display: "flex", gap: theme.spacing(1) }}>
                {(project.screencast || project.demoUrl || project.report) && (
                  <Divider variant="middle" orientation="vertical" flexItem />
                )}
                {project.screencast && (
                  <IconButton size="small" onClick={() => externalResource(project.screencast)}>
                    <YouTube />
                  </IconButton>
                )}
                {project.demoUrl && (
                  <IconButton size="small" onClick={() => externalResource(project.demoUrl)}>
                    <OpenInBrowser />
                  </IconButton>
                )}
                {project.report && (
                  <IconButton size="small" onClick={() => externalResource(project.report)}>
                    <Article />
                  </IconButton>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
      <div style={{ height: "100%", width: "100%", background: "#202025" }}>
        <Laptop project={project} />
      </div>
    </>
  );
};

export default HeroView;
