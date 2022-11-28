import React, { useState } from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

import { theme } from "../../../theme/mui-theme";
import { defaultTheme } from "../../../theme/theme";
import { Project } from "../../../types/Project";
import LanguageLogos from "../../LanguageLogos/LanguageLogos";
import { MDParser } from "../../MDParser/MDParser";
import ResourceLogos from "../../ResourceLogos/ResourceLogos";
import ProjectImages from "./ProjectImages/ProjectImages";

interface Props {
  project: Project;
  isInView: boolean;
}

const DescriptionView: React.FC<Props> = ({ project, isInView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      component="div"
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
      <Box
        component="div"
        style={{
          flex: isExpanded ? 0.8 : 0.3,
          transition: "flex 0.10s ease-out",
          background: defaultTheme.palette.darkGray,
          boxShadow: "0px 0px 5px 2px rgba(0,0,0,.5)",
        }}>
        <ProjectImages project={project} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
      </Box>
      <Box
        component="div"
        sx={{
          flex: 0.7,
          height: "100%",
          background: "white",
          display: "inline-flex",
          flexDirection: "column",
          padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
          justifyContent: "space-between",
          gap: theme.spacing(2),
        }}>
        <Box component="div">
          <Box
            component="div"
            className={`${isInView ? "show-on-delay extended" : "hidden"}`}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="bouncing-arrow-reverse">
              <KeyboardArrowUp viewBox="0 0 20 20" />
            </div>
            <Typography variant="overline" sx={{ lineHeight: 1 }} color="black">
              Swipe up
            </Typography>
          </Box>
        </Box>

        <Box component="div" style={{ overflowY: "auto" }}>
          <Typography component="h3">ABOUT THE PROJECT</Typography>
          <MDParser document={project.description}></MDParser>
          <Typography component="h3" sx={{ mt: theme.spacing(2) }}>
            DEVELOPMENT
          </Typography>
          <MDParser document={project.development}></MDParser>

          <Box component="div" sx={{ mt: theme.spacing(1) }}>
            <Typography variant="body2">
              <strong>Keywords: </strong>
              {project.keywords.map((keyword, idx) => {
                if (idx < project.keywords.length - 1) {
                  return `${keyword}, `;
                }
                return `${keyword}.`;
              })}
            </Typography>
          </Box>
        </Box>

        <div
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            width: "100%",
            flexDirection: "row",
          }}>
          <Box
            component="div"
            sx={{
              display: "flex",
              gap: theme.spacing(2),
              padding: `${theme.spacing(1)}`,
              flex: 1,
            }}>
            <LanguageLogos languages={project?.languages} dialog />
          </Box>

          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}>
            <Box component="div" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="overline" fontSize={10} fontWeight="300" lineHeight={1.2} letterSpacing={1.1}>
                title: {project.title}
              </Typography>
            </Box>

            <Typography variant="overline" fontWeight="300" fontSize={10} lineHeight={1.2} letterSpacing={1.1}>
              Project Size: {project.projectSize}
            </Typography>
          </Box>
          <div style={{ flex: 1, display: "flex", justifyContent: "end" }}>
            <ResourceLogos project={project} />
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default DescriptionView;
