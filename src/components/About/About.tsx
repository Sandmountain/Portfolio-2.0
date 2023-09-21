import React, { useState } from "react";

import Image from "next/image";

import { Box, FormControlLabel, FormGroup, Paper, Slide, Switch, Typography } from "@mui/material";

import { theme } from "../../theme/mui-theme";
import { ContentfulImageType, ContentfulMD } from "../../types/Project";
import { MDParser } from "../MDParser/MDParser";
import WritingIndicator from "./components/WritingIndicator";

interface IAbout {
  about: ContentfulMD;
  profilePicture: ContentfulImageType;
  chatGpt: boolean;
  chatGptQuery: ContentfulMD;
  chatGptAnswer: ContentfulMD;
  chatGptAvatar: ContentfulImageType;
  chatGptSummarize: ContentfulMD;
  shortVersion: ContentfulMD;
}

const About: React.FC<IAbout> = ({
  about,
  profilePicture,
  chatGpt,
  chatGptQuery,
  chatGptAnswer,
  chatGptAvatar,
  chatGptSummarize,
  shortVersion,
}) => {
  const [isShortVersion, setIsShortVersion] = useState(false);

  return (
    <Paper
      sx={{
        width: "50%",
        background: "white",
        margin: theme.spacing(2),
        padding: theme.spacing(4),
        zIndex: 5,
        overflowY: "auto",
        overflowX: "hidden",
      }}
      elevation={15}>
      <Box component="div" sx={{ display: "flex", justifyContent: "space-between", marginBottom: theme.spacing(2) }}>
        <Typography variant="h3" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          About Me <Typography>{isShortVersion && "(Short Version)"}</Typography>
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch value={isShortVersion} dir="vertical" onClick={() => setIsShortVersion(prev => !prev)} />}
            label="Short Version"
          />
        </FormGroup>
      </Box>
      <Slide direction="right" in={isShortVersion} appear={!isShortVersion}>
        <Box component="div" sx={{ position: "relative", height: 0 }}>
          <Box component="div" sx={{ position: "absolute", display: !isShortVersion ? "none" : "auto" }}>
            <Box component="div">
              <Image
                width="100px"
                height="100px"
                objectFit="cover"
                src={`http:${profilePicture.fields?.file.url}`}
                alt={profilePicture.fields?.title}
              />
            </Box>
            <MDParser document={shortVersion} paragraphMargin="1em" />
          </Box>
        </Box>
      </Slide>
      <Slide direction="left" in={!isShortVersion} appear={isShortVersion}>
        <Box component="div" sx={{ position: "relative", height: 0 }}>
          <Box component="div" sx={{ position: "absolute", display: isShortVersion ? "none" : "auto" }}>
            <MDParser document={about} paragraphMargin="1em" />
            {chatGpt && (
              <Box component="div">
                <Paper
                  sx={{ borderRadius: theme.spacing(1), overflow: "hidden", marginBottom: theme.spacing(2) }}
                  elevation={3}>
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      backgroundColor: theme.palette.grey[800],
                      color: theme.palette.common.white,
                      gap: theme.spacing(2),
                      padding: theme.spacing(2),
                      borderBottom: "1px solid black",
                    }}>
                    <Box
                      component="div"
                      sx={{
                        maxHeight: "30px",
                        maxWidth: "30px",
                        borderRadius: 2,
                        overflow: "hidden",
                        borderBottomRightRadius: 0,
                      }}>
                      <Image
                        width="100px"
                        height="100px"
                        objectFit="cover"
                        src={`http:${profilePicture.fields?.file.url}`}
                        alt={profilePicture.fields?.title}
                      />
                    </Box>
                    <MDParser document={chatGptQuery} />
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      gap: theme.spacing(2),
                      backgroundColor: theme.palette.grey[600],
                      color: theme.palette.common.white,
                      padding: theme.spacing(2),
                    }}>
                    <Box component="div" sx={{ minHeight: "30px", minWidth: "30px" }}>
                      <Image
                        width="100px"
                        height="100px"
                        objectFit="contain"
                        src={`http:${chatGptAvatar.fields?.file.url}`}
                        alt={chatGptAvatar.fields?.title}
                      />
                    </Box>
                    <Box component="div">
                      <MDParser document={chatGptAnswer} paragraphMargin="1em" />
                      <WritingIndicator />
                    </Box>
                  </Box>
                </Paper>
                <MDParser document={chatGptSummarize} paragraphMargin="1em" />
              </Box>
            )}
          </Box>
        </Box>
      </Slide>
    </Paper>
  );
};

export default About;
