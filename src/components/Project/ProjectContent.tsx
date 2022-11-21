import React, { useRef, useState } from "react";

import Image from "next/image";

import { KeyboardArrowUp } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Dialog, Typography } from "@mui/material";
// import required modules
import { Mousewheel, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

import { theme } from "../../theme/mui-theme";
import { ContentfulImageType, Project } from "../../types/Project";
import { MDParser } from "../MDParser/MDParser";
import DescriptionView from "./DescriptionView/DescriptionView";
import HeroView from "./HeroView/HeroView";
import Laptop from "./HeroView/Laptop/Laptop";

interface Props {
  project?: Project;
  dialog: boolean;
}

const ProjectContent: React.FC<Props> = ({ project, dialog = false }) => {
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isSecondSlide, setIsSecondSlide] = useState(true);

  if (!project) return <></>;

  const onSlideChange = (s: any) => {
    if (s.activeIndex === 0) {
      setIsFirstSlide(true);
      setIsSecondSlide(false);
    } else {
      setIsSecondSlide(true);
      setIsFirstSlide(false);
    }
  };

  return (
    <Box component="div" display="flex" width="100%" overflow="hidden" height={dialog ? "800px" : "calc(100vh - 50px)"}>
      <Swiper
        direction={"vertical"}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        mousewheel={true}
        onSlideChange={s => onSlideChange(s)}
        className="mySwiper">
        <SwiperSlide style={{ position: "relative", zIndex: 2 }}>
          <HeroView project={project} isInView={isFirstSlide} />
        </SwiperSlide>
        <SwiperSlide>
          <DescriptionView project={project} isInView={isSecondSlide} />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
};

export default ProjectContent;
