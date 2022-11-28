import React from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Divider, Paper, Typography } from "@mui/material";

import { theme } from "../../../theme/mui-theme";
import { defaultTheme } from "../../../theme/theme";
import { Project } from "../../../types/Project";
import LanguageLogos from "../../LanguageLogos/LanguageLogos";
import ResourceLogos from "../../ResourceLogos/ResourceLogos";
import ThreeLoader from "../../ThreeLoader/ThreeLoader";
import Laptop from "./Laptop/Laptop";

interface Props {
  project: Project;
  isInView: boolean;
  active?: boolean;
  dialog: boolean;
}

const HeroView: React.FC<Props> = ({ project, isInView, dialog, active = dialog ? false : true }) => {
  return (
    <Box component="div" sx={{ height: "100%", width: "100%", background: defaultTheme.palette.darkGray }}>
      <Box
        component="div"
        sx={{
          height: "100%",
          width: "100%",
          transition: "filter 0.4s ease-in-out",
          filter: !active ? "blur(3px)" : "blur(0px)",
        }}>
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
          <Typography
            variant="h4"
            style={{
              margin: 0,
              letterSpacing: 0,
              color: project.primaryColor,
              textShadow: "0px 1px 0px rgba(0,0,0.4)",
              fontWeight: "bold",
            }}>
            {project.title}
          </Typography>
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
            {active && (
              <Box
                component="div"
                className={`${isInView ? "show-on-delay" : "hidden"}`}
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Typography variant="overline" style={{ lineHeight: 1, color: "white" }}>
                  Swipe down
                </Typography>
                <div className="bouncing-arrow">
                  <KeyboardArrowDownIcon viewBox="0 0 20 20" htmlColor="#FFF" />
                </div>
              </Box>
            )}
            <Box component="div" sx={{ display: "flex", justifyContent: "end", flex: 1 }}>
              <Paper sx={{ display: "inline-flex", gap: theme.spacing(2), padding: `${theme.spacing(1)}` }}>
                <LanguageLogos languages={project?.languages} dialog />

                <Box component="div" sx={{ display: "flex", gap: theme.spacing(1) }}>
                  {(project.screencast || project.demoUrl || project.report) && (
                    <Divider variant="middle" orientation="vertical" flexItem />
                  )}
                  <ResourceLogos project={project} />
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
        <div style={{ height: "100%", width: "100%" }}>
          {active && (
            <ThreeLoader>
              <Laptop project={project} />{" "}
            </ThreeLoader>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default HeroView;
