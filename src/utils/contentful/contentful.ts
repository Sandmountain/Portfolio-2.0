import { createClient } from "contentful";

import Project from "../../components/Project/Project";
import { ContentfulResponse } from "../../types/Project";

export const initContentful = async (query?: string): Promise<ContentfulResponse> => {
  // init contentful
  const client = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
  });

  if (query) {
    return (await client
      .getEntries({
        content_type: "project",
      })
      .then(res => {
        return {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          items: res.items.filter(prj => prj.fields?.["urlName"] === query),
        };
      })) as unknown as ContentfulResponse;
  } else {
    return (await client.getEntries({
      content_type: "project",
      order: "-sys.createdAt",
    })) as unknown as ContentfulResponse;
  }
};
