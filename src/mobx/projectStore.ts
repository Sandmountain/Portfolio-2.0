import { makeAutoObservable, toJS } from "mobx";

import { ContentfulResponse, Project } from "../types/Project";

class ProjectStore {
  projects: Project[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setProjects(projects: ContentfulResponse) {
    this.projects = this.formatProjects(projects);
  }

  getProjects() {
    return toJS(this.projects);
  }

  // Might not filter, but scroll to that idx instead
  filterProjects(title: string) {
    this.projects = this.projects.filter(project => project.title === title);
  }

  private formatProjects(projects: ContentfulResponse) {
    return projects.items.map(projectResponse => projectResponse.fields);
  }
}

const store = new ProjectStore();

export default store;
