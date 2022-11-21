import React from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Typography } from "@mui/material";

import { Project } from "../../../types/Project";
import Laptop from "./Laptop/Laptop";

interface Props {
  project: Project;
  isInView: boolean;
}

const HeroView: React.FC<Props> = ({ project, isInView }) => {
  return (
    <>
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
        style={{
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
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Box component="div" style={{ display: "inline-flex", gap: 12 }}>
            <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
            <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
            <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
          </Box>
          <Box
            component="div"
            className={`${isInView ? "show-on-delay" : "hidden"}`}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="overline" sx={{ lineHeight: 1 }}>
              Swipe down
            </Typography>
            <div className="bouncing-arrow">
              <KeyboardArrowDownIcon viewBox="0 0 20 20" />
            </div>
          </Box>
          <Box component="div" style={{ display: "inline-flex", gap: 12 }}>
            <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
            <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
            <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
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
