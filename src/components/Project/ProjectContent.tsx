import React, { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Typography } from "@mui/material";
// import required modules
import { Mousewheel, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

import { theme } from "../../theme/mui-theme";
import { Project } from "../../types/Project";
import { MDParser } from "../MDParser/MDParser";
import Laptop from "./Laptop/Laptop";

interface Props {
  project?: Project;
  dialog: boolean;
}

const ProjectContent: React.FC<Props> = ({ project, dialog = false }) => {
  const [isFirstSlide, setIsFirstSlide] = useState(true);

  if (!project) return <></>;

  const onSlideChange = (s: any) => {
    if (s.activeIndex === 0) {
      setIsFirstSlide(true);
    } else {
      setIsFirstSlide(false);
    }
  };

  return (
    <div
      style={{
        height: dialog ? "800px" : "calc(100vh - 50px)",
        width: "100%",
        display: "flex",
        overflow: "hidden",
      }}>
      <Swiper
        direction={"vertical"}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Mousewheel]}
        mousewheel={true}
        onSlideChange={s => onSlideChange(s)}
        className="mySwiper">
        <SwiperSlide style={{ position: "relative", zIndex: 2 }}>
          <div
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
            <h1 style={{ margin: 0 }}>{project?.title}</h1>
            <p>{project?.shortDescription}</p>
          </div>
          <div
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <div style={{ display: "inline-flex", gap: 12 }}>
                <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
                <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
                <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
              </div>
              <Box
                component="div"
                className={`${isFirstSlide ? "show-on-delay" : "hidden"}`}
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="overline" sx={{ lineHeight: 1 }}>
                  Scroll down
                </Typography>
                <div className="bouncing-arrow">
                  <KeyboardArrowDownIcon viewBox="0 0 20 20" />
                </div>
              </Box>
              <div style={{ display: "inline-flex", gap: 12 }}>
                <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
                <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
                <div style={{ height: 42, width: 42, background: "white", borderRadius: 5 }}> </div>
              </div>
            </div>
          </div>
          <div style={{ height: "100%", width: "100%", background: "#202025" }}>
            <Laptop project={project} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div style={{ display: "flex", height: "100%", width: "100%" }}>
            <div style={{ flex: 0.3, background: "#202025", boxShadow: "0px 0px 5px 2px rgba(0,0,0,.5)" }}></div>
            <Box
              component="div"
              sx={{
                flex: 0.7,
                height: "100%",
                background: "white",
                display: "inline-flex",
                flexDirection: "column",
                padding: theme.spacing(2),
                justifyContent: "center",
              }}>
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

              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "end",
                  flexDirection: "column",
                  zIndex: 100,
                  paddingBottom: theme.spacing(2),
                }}>
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    justifyContent: "space-between",
                    width: `calc(70% - ${theme.spacing(2)} )`,

                    flexDirection: "row",
                  }}>
                  <div style={{ display: "inline-flex", gap: 12 }}>
                    <div style={{ height: 42, width: 42, background: "black", borderRadius: 5 }}> </div>
                    <div style={{ height: 42, width: 42, background: "black", borderRadius: 5 }}> </div>
                    <div style={{ height: 42, width: 42, background: "black", borderRadius: 5 }}> </div>
                  </div>
                  <Box
                    component="div"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="overline" fontSize={10} fontWeight="300" lineHeight={1.2} letterSpacing={1.1}>
                      title: {project.title}
                    </Typography>

                    <Typography variant="overline" fontWeight="300" fontSize={10} lineHeight={1.2} letterSpacing={1.1}>
                      Project Size: {project.projectSize}
                    </Typography>
                  </Box>
                  <div style={{ display: "inline-flex", gap: 12 }}>
                    <div style={{ height: 42, width: 42, background: "black", borderRadius: 5 }}> </div>
                    <div style={{ height: 42, width: 42, background: "black", borderRadius: 5 }}> </div>
                    <div style={{ height: 42, width: 42, background: "black", borderRadius: 5 }}> </div>
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProjectContent;
