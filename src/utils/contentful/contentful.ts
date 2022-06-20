import { createClient } from "contentful";

import ProjectStore from "../../mobx/projectStore";
import { Project } from "../../types/Project";

export const initContentful = async () => {
  // init contentful
  const client = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
  });
  const projects = await client.getEntries({
    content_type: "project",
  });

  ProjectStore.setProjects(projects as unknown as Project[]);
};
