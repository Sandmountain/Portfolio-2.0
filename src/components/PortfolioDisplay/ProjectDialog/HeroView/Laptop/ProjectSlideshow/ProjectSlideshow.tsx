/* eslint-disable @next/next/no-img-element */
import React from "react";

import Image from "next/image";

import { Project } from "../../../../../../types/Project";

interface SlideshowProps {
  project?: Project;
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectSlideshow: React.FC<SlideshowProps> = ({ project, currentImage }) => {
  if (!project) return <></>;

  const images = [project.thumbnail, ...project.images];

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {images.map((img, idx) => {
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
