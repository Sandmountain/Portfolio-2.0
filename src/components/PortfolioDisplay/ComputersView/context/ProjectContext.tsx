import React, { ReactNode, createContext, useContext, useState } from "react";

import { Project, ProjectImageType } from "../../../../types/Project";

type ProjectContextType = {
  projects: Project[];
  selectedProject: Project;
  projectIndex: number;
  setProjects: (projects: Project[]) => void;
  setProjectIndex: (idx: number) => void;
  setSelectedProject: (project: Project) => void;
};

const initialProjectContext: ProjectContextType = {
  projects: [],
  selectedProject: {} as Project,
  projectIndex: 0,
  setSelectedProject: () => undefined,
  setProjectIndex: () => undefined,
  setProjects: () => undefined,
};

export const ProjectContext = createContext<ProjectContextType>(initialProjectContext);

export const useProjectContext = (): ProjectContextType => {
  const projectContext = useContext(ProjectContext);

  if (!projectContext) {
    throw new Error("useProjectContext must be used within a ProjectContextProvider");
  }

  return projectContext;
};

interface IProjectContextProvider {
  children: ReactNode;
}

export const ProjectContextProvider: React.FC<IProjectContextProvider> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>({} as Project);
  const [projectIndex, setProjectIndex] = useState<number>(0);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        projectIndex,
        setProjects,
        setProjectIndex,
        setSelectedProject,
      }}>
      {children}
    </ProjectContext.Provider>
  );
};
