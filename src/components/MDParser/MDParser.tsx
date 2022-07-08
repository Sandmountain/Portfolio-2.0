import React, { ReactNode } from "react";

import { ContentfulMD, ContentfulMDLine, ContentfulMDcontent } from "../../types/Project";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Block, Inline } from "@contentful/rich-text-types";
import { Typography } from "@mui/material";

const RICHTEXT_OPTIONS = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: Block | Inline | ContentfulMDLine, children: ReactNode) => {
      if (
        node.content.length === 1 &&
        (node.content[0] as ContentfulMDcontent).marks.length > 0 &&
        (node.content[0] as ContentfulMDcontent).marks[0].type === "code"
      ) {
        return (
          <pre>
            <code>{(node.content[0] as ContentfulMDcontent).value}</code>
          </pre>
        );
      }
      return (
        <Typography variant="body1" sx={{ fontWeight: 300 }}>
          {children}
        </Typography>
      );
    },
    [BLOCKS.HEADING_1]: (node: Block | Inline, children: ReactNode) => {
      return <Typography variant="h1">{children}</Typography>;
    },
    [BLOCKS.HEADING_2]: (node: Block | Inline, children: ReactNode) => {
      return <Typography variant="h2">{children}</Typography>;
    },
    [BLOCKS.HEADING_3]: (node: Block | Inline, children: ReactNode) => {
      return (
        <Typography variant="h3" component="div">
          {children}
        </Typography>
      );
    },
    [BLOCKS.HEADING_4]: (node: Block | Inline, children: ReactNode) => {
      return <Typography variant="h4">{children}</Typography>;
    },
    [BLOCKS.HEADING_5]: (node: Block | Inline, children: ReactNode) => {
      return <Typography variant="h5">{children}</Typography>;
    },
    [BLOCKS.HEADING_6]: (node: Block | Inline, children: ReactNode) => {
      return <Typography variant="h6">{children}</Typography>;
    },
  },

  // renderText: (text: string) => {
  //   return text.split("\n").reduce((children, textSegment, index) => {
  //     return [...children, index > 0 && <br key={index} />, textSegment];
  //   }, [] as string[]);
  // },
};
//

interface MDParserProps {
  document: ContentfulMD;
}
export const MDParser: React.FC<MDParserProps> = ({ document }) => {
  return <>{documentToReactComponents(document as unknown as any, RICHTEXT_OPTIONS)}</>;
};
