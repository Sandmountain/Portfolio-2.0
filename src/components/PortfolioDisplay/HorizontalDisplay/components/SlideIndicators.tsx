import React, { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useSnapshot } from "valtio";

import { theme } from "../../../../theme/mui-theme";
import { ProjectImageType } from "../../../../types/Project";
import { state } from "../../PortfolioView";

interface IndicatorProps {
  projects: ProjectImageType[];
}

export const Indicators: React.FC<IndicatorProps> = ({ projects }) => {
  const [hoveredProject, setHoveredProject] = useState<string>();
  const [focusedIdx, setFocusedIdx] = useState<number>();
  const [oldFocusIdx, setOldFocusedIdx] = useState<number>();

  const snap = useSnapshot(state);

  useEffect(() => {
    const idx = projects.findIndex(proj => proj.id === snap.currentProject?.id);
    setFocusedIdx(idx);
    if (idx !== -1) {
      setOldFocusedIdx(idx);
    }
  }, [projects, snap.currentProject]);

  const onIndicatorClick = (index: number) => {
    // Reset if same project is clicked again
    if (state.currentProject?.id === projects[index].id) {
      state.currentProject = null;
    } else {
      state.currentProject = projects[index];
      setOldFocusedIdx(index);
    }
  };

  const changeProject = (back: boolean) => {
    // convert from proxy to js-object
    const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];
    let idx: number;

    if (snap.currentProject?.id) {
      idx = projects.findIndex(proj => proj.id === snap.currentProject?.id);
    } else {
      idx = projects.findIndex(proj => proj.id === projects[oldFocusIdx ?? 0]?.id);
    }

    if (idx === -1) {
      return;
    }

    const newIndex = idx + (back ? -1 : 1);
    const newProject = state.allProjects?.[newIndex];

    setOldFocusedIdx(newIndex);
    state.currentProject = newProject ?? null;
  };

  const getIndicatorColor = (index: number) => {
    if (index === focusedIdx) {
      return theme.palette.primary.main;
    } else if (index === oldFocusIdx) {
      return "rgba(255,255,255,.7)";
    }

    return "rgba(255,255,255,.3)";
  };

  return (
    <>
      {focusedIdx !== undefined && oldFocusIdx !== undefined && snap.currentView === "horizontal" && (
        <Box
          component="div"
          sx={{
            position: "absolute",
            width: "100%",
            bottom: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Box
            component="div"
            sx={{
              padding: "2px",
              opacity: 0.6,
              gap: "4px",
              backgroundColor: "#cacaca20",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            {hoveredProject || focusedIdx !== undefined ? (
              <Box
                component="div"
                sx={{
                  position: "absolute",
                  pointerEvents: "none",
                  top: -30,
                  whiteSpace: "nowrap",
                }}>
                <p style={{ fontSize: "0.8rem" }}>{hoveredProject ?? state.currentProject?.title}</p>
              </Box>
            ) : (
              <></>
            )}
            <IconButton
              sx={{ height: "16px", width: "16px", padding: "2px", "&:hover": { backgroundColor: "#FFFFFF10" } }}
              onClick={() => changeProject(true)}
              color="inherit">
              <ChevronLeft sx={{ height: "12px", width: "12px" }} htmlColor="#FFFFFF" />
            </IconButton>
            {projects.map((proj, idx) => {
              return (
                <Box
                  component="div"
                  onMouseEnter={() => setHoveredProject(proj.title)}
                  onMouseLeave={() => setHoveredProject(undefined)}
                  onClick={() => onIndicatorClick(idx)}
                  key={proj.id}
                  style={{
                    cursor: "pointer",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: getIndicatorColor(idx),
                  }}
                />
              );
            })}
            <IconButton
              sx={{ height: "16px", width: "16px", padding: "2px", "&:hover": { backgroundColor: "#FFFFFF10" } }}
              onClick={() => changeProject(false)}
              color="inherit">
              <ChevronRight sx={{ height: "12px", width: "12px" }} htmlColor="#FFFFFF" />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};
