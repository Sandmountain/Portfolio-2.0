import React, { LegacyRef, useRef, useState } from "react";

import Image from "next/image";

import { Project as ProjectType } from "../../types/Project";
import { MDParser } from "../MDParser/MDParser";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography, useTheme } from "@mui/material";
import { Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

interface ProjectProps {
  project: ProjectType;
  dialog: boolean;
}

const SIZE = {
  S: "Small",
  M: "Medium",
  L: "Large",
};

const Project: React.FC<ProjectProps> = ({ project, dialog }) => {
  const [activeImage, setActiveImage] = useState(0);

  // const calculateTimeToRead = () => {
  //   // Words per minute
  //   const wpm = 275;

  //   // Images per minute;
  //   const impm = 5;

  //   return Math.round(
  //     typeof document !== "undefined"
  //       ? document.body.innerText.split(" ").filter(function (n) {
  //           return n != "";
  //         }).length /
  //           wpm +
  //           project.images.length / impm
  //       : 0,
  //   );
  // };

  const onFocusedImageClick = (idx: number, url: string) => {
    if (idx !== activeImage) return;
  };

  const theme = useTheme();
  return (
    <Box
      component="div"
      className="projectLayout-container"
      sx={{ background: "white", height: dialog ? "80vh" : "calc(100vh - 50px)" }}>
      <Box component="div" className="projectLayout-header">
        <Typography variant="h1" fontSize="2.5rem" fontWeight="bold" sx={{ color: theme.palette.primary.dark }}>
          {project.title}
        </Typography>
      </Box>
      <Box component="div" className="projectLayout-content">
        <Box component="div" className="static-image-container">
          <Typography
            variant="overline"
            sx={{ alignSelf: "center", opacity: "25%", maxWidth: "60%", lineHeight: "1em" }}>
            {project.shortDescription}
          </Typography>
          <Box
            component="div"
            className="static-image"
            sx={{ backgroundImage: `url(https:${project.thumbnail.fields.file.url})` }}
          />
        </Box>
        <Box component="div" className="content">
          <Box component="div" sx={{ height: "100%" }}>
            <Box component="div" sx={{ margin: "0px 20%" }}>
              <Box component="div" sx={{ maxWidth: "80%", margin: "0 auto" }}>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    mb: theme.spacing(2),
                    mt: theme.spacing(1),
                  }}>
                  <Box component="div" sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="overline" fontSize={10} fontWeight="300" lineHeight={1.2} letterSpacing={1.1}>
                      title: {project.title}
                    </Typography>
                    <Typography variant="overline" fontSize={10} fontWeight={300} lineHeight={1.2} letterSpacing={1.1}>
                      <FontAwesomeIcon icon="clock" color="gray" style={{ marginRight: theme.spacing(1 / 2) }} />
                      {/* {calculateTimeToRead()} min read */} 0 min read
                    </Typography>
                  </Box>
                  <Box component="div" sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="overline" fontWeight="300" fontSize={10} lineHeight={1.2} letterSpacing={1.1}>
                      Project Size
                    </Typography>
                    <Typography
                      variant="overline"
                      align="right"
                      fontSize={10}
                      fontWeight="300"
                      lineHeight={1.2}
                      letterSpacing={1.1}>
                      {SIZE[project.projectSize]}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h3"
                  fontSize="13.3px"
                  fontWeight="bold"
                  letterSpacing={1.5}
                  sx={{
                    textAlign: "center",
                    marginBottom: theme.spacing(1),
                    textTransform: "uppercase",
                    color: theme.palette.primary.main,
                  }}>
                  About the project
                </Typography>
                {<MDParser document={project.description} />}
              </Box>
            </Box>
            <Box component="div" sx={{ background: "lightgray", m: theme.spacing(2, 0) }}>
              <Swiper
                slidesPerView={"auto"}
                centeredSlides={true}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                slideToClickedSlide
                onSlideChange={e => setActiveImage(e.snapIndex)}
                modules={[Pagination]}>
                {project.images.map((image, idx) => {
                  const square = image.metadata.tags.length > 0;

                  return (
                    <SwiperSlide key={idx} style={{ width: "auto", height: "auto" }}>
                      <Image
                        onClick={() => onFocusedImageClick(idx, image.fields.file.url)}
                        className="zoomContent-image"
                        width="420"
                        height="180"
                        objectFit="cover"
                        style={{ cursor: activeImage === idx ? "pointer" : "auto" }}
                        src={`http:${image.fields.file.url}`}
                        alt={image.fields.title}
                      />
                    </SwiperSlide>
                  );
                })}
                <Typography component="p" variant="caption" align="center" sx={{ margin: "10px 0" }}>
                  <b>Figure {activeImage + 1}:</b> {project.images[activeImage].fields.description}
                </Typography>
              </Swiper>
            </Box>
            <Box component="div" sx={{ margin: "0px 20%" }}>
              <Typography
                variant="h3"
                fontSize="13.3px"
                fontWeight="bold"
                letterSpacing={1.5}
                sx={{
                  textAlign: "center",
                  marginBottom: theme.spacing(1),
                  textTransform: "uppercase",
                  color: theme.palette.primary.main,
                }}>
                Development
              </Typography>
              <Box component="div" sx={{ maxWidth: "80%", margin: "0 auto" }}>
                {<MDParser document={project.development} />}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box component="div" className="projectLayout-footer">
        <Box component="div" sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h3"
            fontSize="13.3px"
            fontWeight="bold"
            letterSpacing={1.5}
            sx={{
              textAlign: "center",
              marginBottom: theme.spacing(1),
              textTransform: "uppercase",
              color: theme.palette.primary.main,
            }}>
            Development
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Project;
