import React, { ReactNode } from "react";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Block, Inline } from "@contentful/rich-text-types";
import { Box, Typography } from "@mui/material";

import { ContentfulMD, ContentfulMDLine, ContentfulMDcontent } from "../../types/Project";




interface MDParserProps {

  document: ContentfulMD;
  fontSize?: number;
}
export const MDParser: React.FC<MDParserProps> = ({ document, fontSize="auto" }) => {

  const mdRender = () => {
    return {
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
            <Typography variant="body1" sx={{ fontWeight: 300 }} fontSize={fontSize}>
              {children}
            </Typography>
          );
        },
        [BLOCKS.HEADING_1]: (node: Block | Inline, children: ReactNode) => {
          return <Typography variant="h1" fontSize={fontSize}>{children}</Typography>;
        },
        [BLOCKS.HEADING_2]: (node: Block | Inline, children: ReactNode) => {
          return <Typography variant="h2" fontSize={fontSize}>{children}</Typography>;
        },
        [BLOCKS.HEADING_3]: (node: Block | Inline, children: ReactNode) => {
          return (
            <Typography variant="h3" component="div" fontSize={fontSize}>
              {children}
            </Typography>
          );
        },
        [BLOCKS.HEADING_4]: (node: Block | Inline, children: ReactNode) => {
          return <Typography variant="h4" fontSize={fontSize}>{children}</Typography>;
        },
        [BLOCKS.HEADING_5]: (node: Block | Inline, children: ReactNode) => {
          return <Typography variant="h5" fontSize={fontSize}>{children}</Typography>;
        },
        [BLOCKS.HEADING_6]: (node: Block | Inline, children: ReactNode) => {
          return <Typography variant="h6" fontSize={fontSize}>{children}</Typography>;
        },
      },
    
      renderText: (text: string) => {
        return text.split("\n").reduce((children, textSegment, index) => {
          return [...children, index > 0 ? <br key={index} /> : "", textSegment];
        }, [] as any[]);
      },
    };
  }

  return <Box component="div" sx={{fontSize: fontSize}}>{documentToReactComponents(document as unknown as any, mdRender())}</Box>;
};
