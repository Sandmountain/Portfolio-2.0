import React from "react";

import { Box } from "@mui/material";
import { Loader } from "@react-three/drei";

import { Project, ProjectImageType } from "../../../types/Project";
import { ComputerScene } from "./ComputerScene/ComputersScene";

interface IComputerView {
  images: ProjectImageType[];
  projects: Project[];
}

const ComputerView: React.FC<IComputerView> = ({ images, projects }) => {
  // console.log(images);

  return (
    <>
      <ComputerScene />
      <Loader />
      {/* <Box
        component="div"
        sx={{ width: "100vw", position: "absolute", bottom: 20, left: 0, display: "flex", justifyContent: "center" }}>
        <Box
          component="div"
          sx={{
            position: "relative",
            width: "50%",
            height: "5em",
            background: "rgba(255,255,255,0.2)",
            color: "black",
            borderRadius: "5px",
          }}>
          Hallo
        </Box>
      </Box> */}
    </>
  );
};

export default ComputerView;
