import { Project, ProjectImageType } from "../../types/Project";

const HIGHLIGHT_IDX = 3;

// 2 3 4 [ 1 ] 5 6 7
// export const getImages = (projects: Project[]): ProjectImageType[] => {
//   if (projects.length < 1) return [];

//   // Hard copy of projects and remove first element
//   const highlight = projects[0];
//   const projectCopy = [...projects];
//   projectCopy.shift();

//   const positions = projectCopy.reduce((prev, project, index) => {
//     if (index > 5) return prev;

//     if (index < 3) {
//       prev.push({
//         // Very hardcoded and ugly.
//         position: [-6.5 + 2 * index, 0, 2.5],
//         rotation: [0, 0, 0],
//         url: project.thumbnail.fields.file.url,
//         id: project.uuid,
//         title: project.title,
//       });
//     } else {
//       prev.push({
//         // Using modulo3 to restart the index
//         position: [2.5 + 2 * (index % 3), 0, 2.5],
//         rotation: [0, 0, 0],
//         url: project.thumbnail.fields.file.url,
//         id: project.uuid,
//         title: project.title,
//       });
//     }
//     return prev;
//   }, [] as ProjectImageType[]);

//   // Insert highlight item in the correct position in the array
//   positions.splice(HIGHLIGHT_IDX, 0, {
//     position: [0, 0, 3.5],
//     rotation: [0, 0, 0],
//     url: highlight.thumbnail.fields.file.url,
//     id: highlight.uuid,
//     title: highlight.title,
//   });

//   return positions;
// };

// [ 1 ] 2 3 4 5 6 ....
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

const projectOffset = 0.2;

export const moveProjectFramesOnFocus = (
  images: ProjectImageType[],
  projectFrames: THREE.Object3D<THREE.Event>[],
  focusId: string,
) => {
  const currentIdx = images.findIndex(img => img.id === focusId);
  let foundIndex = false;

  resetProjectsPosition(images, projectFrames);

  projectFrames.forEach((proj, index) => {
    if (index === currentIdx) {
      foundIndex = true;
      return;
    }

    if (!foundIndex) {
      proj.position.x = -projectOffset + proj.position.x;
    } else {
      proj.position.x = projectOffset + proj.position.x;
    }
  });
};

export const resetProjectsPosition = (images: ProjectImageType[], projectFrames: THREE.Object3D<THREE.Event>[]) => {
  projectFrames.forEach((proj, index) => {
    proj.position.x = images[index].position[0];
  });
};
