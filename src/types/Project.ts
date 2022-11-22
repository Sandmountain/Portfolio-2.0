export interface Project {
  banner: ContentfulImageType;
  courseUrl: string;
  description: ContentfulMD;
  development: ContentfulMD;
  demoUrl: string;
  screencast: string;
  status: ProjectStatusType;
  finished: string;
  primaryColor: string;
  githubUrl: string;
  images: ContentfulImageType[];
  keywords: string[];
  projectSize: "S" | "M" | "L";
  report: string;
  shortDescription: string;
  thumbnail: ContentfulImageType;
  title: string;
  urlName: string;
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
  content: ContentfulMDLine[];
  nodeType: string;
}

export interface ContentfulMDLine extends ContentfulMDNodeType {
  content: ContentfulMDcontent[];
  data: unknown;
}

export interface ContentfulMDcontent {
  marks: ContentfulMDcontentMarks[];
  nodeType: string;
  value: string;
}

export interface ContentfulMDcontentMarks {
  type: "bold" | "italic" | "underline" | "code";
}

export interface ContentfulMDNodeType {
  nodeType:
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "paragraph"
    | "blockquote"
    | "unordered-list"
    | "ordered-list"
    | "hr"
    | "hyperlink";
}
