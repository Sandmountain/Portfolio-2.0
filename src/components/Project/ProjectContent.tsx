import React, { Suspense, useRef, useState } from "react";

import Image from "next/image";

import { KeyboardArrowUp } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
// import required modules
import { Mousewheel, Pagination, Swiper as SwiperType } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";
import { useSnapshot } from "valtio";

import { theme } from "../../theme/mui-theme";
import { defaultTheme } from "../../theme/theme";
import { ContentfulImageType, Project, ProjectImageType } from "../../types/Project";
import { state } from "../HorizontalProjectDisplay/HorizontalProjectDisplay";
import { MDParser } from "../MDParser/MDParser";
import ThreeLoader from "../ThreeLoader/ThreeLoader";
import DescriptionView from "./DescriptionView/DescriptionView";
import HeroView from "./HeroView/HeroView";
import Laptop from "./HeroView/Laptop/Laptop";

interface Props {
  project?: Project;
  projects?: Project[];
  dialog: boolean;
}

const ProjectContent: React.FC<Props> = ({ project, dialog = false, projects }) => {
  const snap = useSnapshot(state);
  const [activeProjectIndex, setActiveIndexProject] = useState(
    snap?.allProjects?.findIndex(proj => proj.id === snap.currentProject?.id) ?? 0,
  );

  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isSecondSlide, setIsSecondSlide] = useState(true);

  const swiperRef = useRef<SwiperType>();

  if (!project) return <></>;

  console.log(project);

  const onNestedSlideChange = (s: SwiperType) => {
    if (s.activeIndex === 0) {
      setIsFirstSlide(true);
      setIsSecondSlide(false);
    } else {
      setIsSecondSlide(true);
      setIsFirstSlide(false);
    }
  };

  const onProjectChanged = (s: SwiperType) => {
    setActiveIndexProject(s.activeIndex);
  };

  const renderContent = () => {
    if (dialog && projects) {
      return (
        <Swiper
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          onSlideChange={onProjectChanged}
          initialSlide={activeProjectIndex}
          className="mySwiper swiper-h"
          lazy
          onBeforeInit={swiper => {
            swiperRef.current = swiper;
          }}>
          {projects.map((proj, idx) => {
            return (
              <SwiperSlide key={proj.uuid}>
                <Swiper
                  lazy
                  direction={"vertical"}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  mousewheel={true}
                  onSlideChange={s => {
                    onNestedSlideChange(s);
                    if (swiperRef.current) {
                      // Only allow changing project when the HeroView is in focus.
                      if (s.activeIndex !== 0) {
                        swiperRef.current.allowSlideNext = false;
                        swiperRef.current.allowSlidePrev = false;
                        swiperRef.current.pagination.el.hidden = true;
                      } else {
                        swiperRef.current.allowSlideNext = true;
                        swiperRef.current.allowSlidePrev = true;
                        swiperRef.current.pagination.el.hidden = false;
                      }
                    }
                  }}
                  className="mySwiper">
                  <SwiperSlide style={{ position: "relative", zIndex: 2 }}>
                    <HeroView project={proj} isInView={isFirstSlide} active={idx === activeProjectIndex} dialog />
                  </SwiperSlide>
                  <SwiperSlide>
                    {idx === activeProjectIndex && <DescriptionView project={proj} isInView={isSecondSlide} />}
                  </SwiperSlide>
                </Swiper>
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
    }
    return (
      <Swiper
        lazy
        direction={"vertical"}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        mousewheel={true}
        onSlideChange={s => onNestedSlideChange(s)}
        className="mySwiper">
        <SwiperSlide style={{ position: "relative", zIndex: 2 }}>
          <HeroView project={project} isInView={isFirstSlide} active dialog />
        </SwiperSlide>
        <SwiperSlide>
          <DescriptionView project={project} isInView={isSecondSlide} />
        </SwiperSlide>
      </Swiper>
    );
  };

  return (
    <Suspense fallback={"it is loading i promise"}>
      <Box
        component="div"
        display="flex"
        width="100%"
        overflow="hidden"
        height={dialog ? "800px" : "calc(100vh - 50px)"}>
        {renderContent()}
      </Box>
    </Suspense>
  );
};

export default ProjectContent;
