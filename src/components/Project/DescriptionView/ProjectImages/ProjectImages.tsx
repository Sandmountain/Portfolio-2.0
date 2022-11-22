import React, { useEffect, useState } from "react";

import Image from "next/image";

import { FullscreenSharp, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { Box, Button, Dialog, IconButton, Paper, Typography, makeStyles } from "@mui/material";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperProps, SwiperSlide, useSwiper } from "swiper/react";

import { theme } from "../../../../theme/mui-theme";
import { defaultTheme } from "../../../../theme/theme";
import { ContentfulImageType, Project } from "../../../../types/Project";

interface Props {
  project: Project;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectImages: React.FC<Props> = ({ project, isExpanded, setIsExpanded }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState<ContentfulImageType>(project.images[0]);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  useEffect(() => {
    setFullScreenImage(project.images[0]);
  }, [project]);

  const swiper = useSwiper();

  const onThumbnailClick = (image: ContentfulImageType, idx: number) => {
    setFullScreenImage(image);
    setActiveImage(idx);
  };

  const onFocusedImageClick = () => {
    setIsFullScreenImage(true);
  };

  const onExpandedClick = () => {
    setIsExpanded(prev => !prev);
  };

  const disableSwiping = () => {
    swiper.allowTouchMove = false;
  };

  const enableSwiping = () => {
    swiper.allowTouchMove = true;
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",

          padding: theme.spacing(1),
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
        }}
        onMouseOver={disableSwiping}
        onMouseLeave={enableSwiping}>
        <Image
          style={{
            pointerEvents: "none",
            opacity: 0.1,
            zIndex: 0,

            filter: "blur(5px) grayscale(0.4)",
          }}
          layout="fill"
          objectFit="cover"
          src={`http:${fullScreenImage.fields.file.url}`}
          alt={fullScreenImage.fields.title}
        />
        <Box component="div" sx={{ display: "flex", width: "100%", justifyContent: "end", zIndex: 1 }}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <IconButton size="small" color="white" onClick={onExpandedClick}>
            {isExpanded ? <KeyboardDoubleArrowLeft /> : <KeyboardDoubleArrowRight />}
          </IconButton>
        </Box>

        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            height: "70%",
            width: "80%",
            borderRadius: 3,
            overflow: "hidden",
            backgroundClip: "revert",
            zIndex: 1,
          }}>
          <Box
            component="div"
            sx={{
              display: "flex",
              flex: 0.8,
              height: "auto",
              position: "relative",
            }}>
            <Image
              draggable={false}
              className="zoomContent-image"
              onClick={() => onFocusedImageClick()}
              style={{ cursor: "pointer" }}
              layout="fill"
              objectFit="cover"
              src={`http:${fullScreenImage.fields.file.url}`}
              alt={fullScreenImage.fields.title}
            />
          </Box>
          <Paper component="div" elevation={5} sx={{ width: "100%", padding: theme.spacing(2), flex: 0.2 }}>
            <Typography variant="subtitle2" sx={{ mt: theme.spacing(1) }}>
              <strong>{fullScreenImage.fields.title}</strong>
            </Typography>
            <Typography variant="caption">{fullScreenImage.fields.description}</Typography>
          </Paper>
        </Paper>

        <Box
          component="div"
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: theme.spacing(1),
            marginTop: theme.spacing(3),
            justifyContent: "center",
            overflow: "hidden",
            zIndex: 1,
          }}>
          {project.images.map((image, idx) => {
            return (
              <Image
                key={idx}
                onClick={() => onThumbnailClick(image, idx)}
                className={`galleryImage-thumbnail ${idx === activeImage ? "active" : ""}`}
                width="420"
                height="180"
                objectFit="cover"
                style={{ cursor: "pointer", aspectRatio: "16/2" }}
                src={`http:${image.fields?.file.url}`}
                alt={image.fields?.title}
              />
            );
          })}
        </Box>
      </Box>
      <Dialog
        BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,.8)" } }}
        maxWidth="lg"
        open={isFullScreenImage}
        onClose={() => setIsFullScreenImage(false)}>
        <Image
          draggable={false}
          style={{ cursor: "pointer", width: "100%", height: "100%" }}
          height={fullScreenImage.fields.file.details.image.height}
          width={fullScreenImage.fields.file.details.image.width}
          quality={100}
          src={`http:${fullScreenImage.fields.file.url}`}
          alt={fullScreenImage.fields.title}
        />
      </Dialog>
    </>
  );
};

export default ProjectImages;
