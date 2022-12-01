import * as THREE from "three";

import { Project, ProjectImageType } from "../../../../types/Project";

export const getImages = (projects: Project[]): ProjectImageType[] => {
  if (projects.length < 1) return [];

  // Hard copy of projects and remove first element

  const projectCopy = [...projects];

  const positions = projectCopy.reduce((prev, project, index) => {
    prev.push({
      position: [2 * index, 0, 2.5],
      rotation: [0, 0, 0],
      url: project.thumbnail.fields.file.url,
      id: project.uuid,
      title: project.title,
    });

    return prev;
  }, [] as ProjectImageType[]);

  return positions;
};

const projectOffset = 0.15;

export const moveProjectFramesOnFocus = (
  images: ProjectImageType[],
  projectFrames: THREE.Object3D<THREE.Event>[],
  focusId: string,
  delta: number,
) => {
  const currentIdx = images.findIndex(img => img.id === focusId);
  let foundIndex = false;

  resetProjectsPosition(images, projectFrames, delta);

  projectFrames.forEach((proj, index) => {
    if (index === currentIdx) {
      foundIndex = true;
      return;
    }

    if (!foundIndex) {
      proj.position.x = THREE.MathUtils.damp(proj.position.x, -projectOffset + proj.position.x, 6, delta);
    } else {
      proj.position.x = THREE.MathUtils.damp(proj.position.x, projectOffset + proj.position.x, 6, delta);
    }
  });
};

export const resetProjectsPosition = (
  images: ProjectImageType[],
  projectFrames: THREE.Object3D<THREE.Event>[],
  delta: number,
) => {
  projectFrames.forEach((proj, index) => {
    proj.position.x = THREE.MathUtils.damp(proj.position.x, images[index].position[0], 6, delta);
  });
};
