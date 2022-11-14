import React from "react";

import { ContentfulLanguageType } from "../../types/Project";
import LanguageIcon from "../LanguageIcon/LanguageIcon";

import { Box } from "@mui/material";

interface LanguageLogosProps {
  languages: ContentfulLanguageType[] | undefined;
  dialog: boolean;
}

const LanguageLogos: React.FC<LanguageLogosProps> = ({ languages = [], dialog }) => {
  const renderLogos = (languages?: ContentfulLanguageType[]) => {
    if (languages) {
      return languages.map((language, key) => (
        <Box component="div" sx={{ padding: "5px 0px" }} key={language}>
          <LanguageIcon key={key} language={language} size={dialog ? "small" : "medium"} />
        </Box>
      ));
    }
  };

  return (
    <Box component="div" sx={{ display: "flex", gap: 2 }}>
      {renderLogos(languages)}
    </Box>
  );
};

export default LanguageLogos;
