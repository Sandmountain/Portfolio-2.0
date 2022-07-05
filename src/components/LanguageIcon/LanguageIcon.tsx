import React from "react";

import Image from "next/image";

import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ContentfulLanguageType } from "../../types/Project";

interface LanguageIconProps {
  language: ContentfulLanguageType;
  size?: "small" | "medium";
}

const LanguageIcon: React.FC<LanguageIconProps> = ({ language, size = "medium" }) => {
  return (
    <>
      {language.fields.icon && (
        <FontAwesomeIcon
          size={(size === "small" ? "md" : "xl") as SizeProp}
          color="rgba(0, 0, 0, 0.54)"
          icon={language.fields.icon as IconProp}></FontAwesomeIcon>
      )}
      {language.fields.img && (
        <Image
          priority={true}
          width={size === "small" ? 16 : 24}
          height={size === "small" ? 12 : 16}
          quality="75"
          src={`https:${language.fields.img.fields.file.url}${size === "small" ? "?w=32" : "?w=48"}`}
          alt={language.fields.name}></Image>
      )}
    </>
  );
};

export default LanguageIcon;
