import { makeAutoObservable, toJS } from "mobx";
import getUuid from "uuid-by-string";

import { createContext, useContext } from "react";

import { getImages } from "../components/HorizontalProjectDisplay/handleProjects";
import { ContentfulResponse, Project } from "../types/Project";

class ProjectStore {
  projects: Project[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setProjects(projects: Project[]) {
    this.projects = projects;
  }

  getProjects() {
    return toJS(this.projects);
  }

  getProjectImages() {
    return getImages(toJS(this.projects));
  }

  // Might not filter, but scroll to that idx instead
  filterProjects(title: string) {
    this.projects = this.projects.filter(project => project.title === title);
  }
}

const StoreContext = createContext<ProjectStore>(new ProjectStore());

interface StoreProviderProps {
  store: ProjectStore;
  children: React.ReactNode;
}

const ProjectStoreProvider: React.FC<StoreProviderProps> = ({ store, children }) => {
  return <StoreContext.Provider value={store}> {children} </StoreContext.Provider>;
};

const useProjectStore = () => {
  return useContext(StoreContext);
};

export { ProjectStore, ProjectStoreProvider, useProjectStore };

/*

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const images = [
  // Front
  {
    position: [0, 0.0, 4],
    rotation: [0, 0, 0],
    url: "https://images.ctfassets.net/pesye57ju1o0/79b9VRv3W5mFfYqLr9Nl5Y/47d859ade2c16f9214c8fa9b079290b4/thumbnail.png?w=1260",
  },

  // Right
  {
    position: [1.5, 0, 3],
    rotation: [0, 0, 0],
    url: "https://images.ctfassets.net/pesye57ju1o0/7eg6cmDNlAnwbt8U89ZlBF/3c96861f4d5f069ca3dba6f57b36a674/thumbnail.png?w=1260",
  },
  { position: [2.6, 0, 3], rotation: [0, 0, 0], url: pexel(227675) },
  { position: [3.7, 0, 3], rotation: [0, 0, 0], url: pexel(911738) },

  // Left
  { position: [-1.5, 0, 3], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [-2.6, 0, 3], rotation: [0, 0, 0], url: pexel(327482) },
  { position: [-3.7, 0, 3], rotation: [0, 0, 0], url: pexel(325185) },
];

*/
