export interface Project {
  banner: ContentfulImageType;
  courseUrl: string;
  description: ContentfulMD;
  development: ContentfulMD;
  demoUrl: string;
  status: ProjectStatusType;
  finished: string;
  githubUrl: string;
  images: ContentfulImageType[];
  keywords: string[];
  projectSize: "S" | "M" | "L";
  report: string;
  shortDescription: string;
  thumbnail: ContentfulImageType;
  title: string;
  languages: ContentfulLanguageType[];
  uuid: string;
}

export type ProjectStatusType = "finished" | "ongoing" | "discontinued";

export interface ProjectImageType {
  position: number[];
  rotation: number[];
  url: string;
  id: string;
  title: string;
}

export interface ContentfulResponse {
  items: {
    metadata: { tags: string[] };
    fields: Project;
    sys: {
      contentType: { sys: { id: string } };
      createdAt: string;
      updatedAt: string;
    };
  }[];
}

export interface ContentfulLanguageType {
  fields: { name: string; icon?: string; img?: ContentfulImageType };
}

export interface ContentfulImageType {
  fields: {
    title: string;
    description: string;
    file: ContentfulFile;
  };
  metadata: { tags: string[] };
}

export interface ContentfulFile {
  contentType: string;
  details: {
    image: { width: number; height: number };
    size: number;
  };
  fileName: string;
  url: string;
  title: string;
}

export interface ContentfulMD {
  content: ContentfulMDcontent[];
  nodeType: string;
}

interface ContentfulMDcontent {
  marks: ContentfulMDcontentMarks[];
  nodeType: string;
  value: string;
}

interface ContentfulMDcontentMarks {
  type: "bold" | "italic" | "underline";
}
