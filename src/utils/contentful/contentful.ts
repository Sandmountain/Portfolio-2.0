import { createClient } from "contentful";

import { ContentfulResponse } from "../../types/Project";

export const initContentful = async (): Promise<ContentfulResponse> => {
  // init contentful
  const client = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
  });
  const projects = await client.getEntries({
    content_type: "project",
    order: "-sys.createdAt",
  });

  return projects as unknown as ContentfulResponse;
};
