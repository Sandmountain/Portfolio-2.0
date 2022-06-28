import { Project, ProjectImageType } from "../../types/Project";

const HIGHLIGHT_IDX = 3;

export const getImages = (projects: Project[]): ProjectImageType[] => {
  if (projects.length < 1) return [];

  // Hard copy of projects and remove first element
  const highlight = projects[0];
  const projectCopy = [...projects];
  projectCopy.shift();

  const positions = projectCopy.reduce((prev, project, index) => {
    if (index > 5) return prev;

    if (index < 3) {
      prev.push({
        // Very hardcoded and ugly.
        position: [-6.5 + 2 * index, 0, 2.5],
        rotation: [0, 0, 0],
        url: project.thumbnail.fields.file.url,
        id: project.uuid,
        title: project.title,
      });
    } else {
      prev.push({
        // Using modulo3 to restart the index
        position: [2.5 + 2 * (index % 3), 0, 2.5],
        rotation: [0, 0, 0],
        url: project.thumbnail.fields.file.url,
        id: project.uuid,
        title: project.title,
      });
    }
    return prev;
  }, [] as ProjectImageType[]);

  // Insert highlight item in the correct position in the array
  positions.splice(HIGHLIGHT_IDX, 0, {
    position: [0, 0, 3.5],
    rotation: [0, 0, 0],
    url: highlight.thumbnail.fields.file.url,
    id: highlight.uuid,
    title: highlight.title,
  });

  return positions;
};
