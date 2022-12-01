import React from "react";

import { Box } from "@mui/material";

import { ContentfulLanguageType } from "../../../../types/Project";
import LanguageIcon from "./LanguageIcon/LanguageIcon";

interface LanguageLogosProps {
  languages: ContentfulLanguageType[] | undefined;
  dialog: boolean;
}

const LanguageLogos: React.FC<LanguageLogosProps> = ({ languages = [], dialog }) => {
  const renderLogos = (languages?: ContentfulLanguageType[]) => {
    if (languages) {
      return languages.map((language, key) => (
        <Box component="div" key={language.fields.name} sx={{ display: "flex", alignItems: "center" }}>
          <LanguageIcon key={key} language={language} size={dialog ? "small" : "medium"} />
        </Box>
      ));
    }
  };

  return (
    <Box component="div" sx={{ display: "flex", gap: { md: "12px", sm: "6px" } }}>
      {renderLogos(languages)}
    </Box>
  );
};

export default LanguageLogos;
