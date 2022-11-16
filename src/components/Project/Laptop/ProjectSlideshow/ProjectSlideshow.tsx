/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Pagination } from "swiper";
// import required modules
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { ContentfulImageType, Project } from "../../../../types/Project";

interface SlideshowProps {
  project?: Project;
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectSlideshow: React.FC<SlideshowProps> = ({ project, currentImage, setCurrentImage }) => {
  const [images, setImages] = useState<ContentfulImageType[]>();
  const imagesRef = useRef<HTMLImageElement>(null);

  // const startSlideShow = () => {
  //   setTimeout(startSlideShow, 2000);
  // };

  // useEffect(() => {
  //   if (project.images.length > 0) {
  //     startSlideShow();
  //   }
  // }, [project.images, startSlideShow]);
  return (
    <div style={{ userSelect: "none" }}>
      {project?.images.map((img, idx) => {
        if (idx === currentImage) {
          return (
            <Image
              className="slideshowImage slideshowImage-slide-in"
              key={img.fields.title}
              style={{ pointerEvents: "none" }}
              layout="fill"
              src={`http:${img.fields.file.url}`}
              alt={img.fields.title}
            />
          );
        } else if (idx === currentImage - 1) {
          return (
            <Image
              className="slideshowImage slideshowImage-slide-out"
              key={img.fields.title}
              style={{ pointerEvents: "none" }}
              layout="fill"
              src={`http:${img.fields.file.url}`}
              alt={img.fields.title}
            />
          );
        }
        return (
          <Image
            className="slideshowImage"
            key={img.fields.title}
            style={{ pointerEvents: "none", opacity: 0 }}
            layout="fill"
            src={`http:${img.fields.file.url}`}
            alt={img.fields.title}
          />
        );
      })}
    </div>
  );
};

export default ProjectSlideshow;
