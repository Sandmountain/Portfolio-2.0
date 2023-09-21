import React from "react";

import { styled } from "@mui/material";

const Pulsate = styled("div")({
  "@keyframes pulsate": {
    "0%": {
      opacity: 0,
    },
    "20%": {
      opacity: 1,
    },
    "80%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
  animation: "pulsate 1s infinite ease",
  width: "8px",
  height: "1em",
  backgroundColor: "white",
  marginTop: "1em",
});

const WritingIndicator: React.FC = () => {
  return <Pulsate></Pulsate>;
};

export default WritingIndicator;
