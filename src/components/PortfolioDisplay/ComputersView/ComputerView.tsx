import React, { useCallback } from "react";

import Image from "next/image";

import { Box } from "@mui/material";

import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import { ComputerScene } from "./ComputerScene/ComputersScene";
import { useProjectContext } from "./context/ProjectContext";

const ComputerView: React.FC = () => {
  const { projects, projectIndex, setSelectedProject, setProjectIndex } = useProjectContext();

  const onImageChange = useCallback(
    (idx: number) => {
      setSelectedProject(projects[idx]);
      setProjectIndex(idx);
    },
    [projects, setProjectIndex, setSelectedProject],
  );

  if (!projects) return <></>;

  return (
    <>
      <ComputerScene />

      <Box
        component="div"
        sx={{
          width: "100vw",
          position: "absolute",
          bottom: "1em",
          left: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}>
        <ImageCarousel onImageChange={onImageChange} width="50%">
          {projects.map((itm, idx) => {
            return (
              <Box
                key={idx}
                component="div"
                sx={{
                  flex: "0 0 auto",
                  order: idx,
                  width: "6em",
                  height: "3em",
                  aspectRatio: "16/9",
                  position: "relative",
                  overflow: "hidden",
                  outline: idx === projectIndex ? "4px solid green" : "none",
                  ":hover": {
                    outline: "4px solid green",
                  },
                }}>
                <Image
                  draggable="false"
                  objectFit="cover"
                  layout="fill"
                  style={{ cursor: "pointer", userSelect: "none" }}
                  src={`http:${itm.thumbnail.fields.file.url}`}
                  objectPosition="50% 50%"
                  alt={"alt"}
                  placeholder="blur"
                  blurDataURL={`http:${itm.thumbnail.fields.file.url}`}
                />
              </Box>
            );
          })}
        </ImageCarousel>
      </Box>
    </>
  );
};

export default ComputerView;
