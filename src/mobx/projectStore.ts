import { makeAutoObservable, toJS } from "mobx";

import { Project } from "../types/Project";

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

  // Might not filter, but scroll to that idx instead
  filterProjects(title: string) {
    this.projects = this.projects.filter(project => project.title === title);
  }
}

const store = new ProjectStore();

export default store;
