import React from "react";

import { ContentfulLanguageType } from "../../types/Project";
import LanguageIcon from "../LanguageIcon/LanguageIcon";

import { Box } from "@mui/material";

interface LanguageLogosProps {
  languages: ContentfulLanguageType[] | undefined;
}

const LanguageLogos: React.FC<LanguageLogosProps> = ({ languages = [] }) => {
  const renderLogos = (languages?: ContentfulLanguageType[]) => {
    if (languages) {
      return languages.map((language, key) => <LanguageIcon key={key} language={language} size="small" />);
    }
  };

  return (
    <Box component="div" sx={{ display: "flex", gap: 2 }}>
      {renderLogos(languages)}
    </Box>
  );
};

export default LanguageLogos;
