import React from "react";

import { Typography } from "@mui/material";

// import { NavbarContainer as Container } from "./Navbar.styled";

function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        alignItems: "center",
        height: "50px",
        color: "white",
        padding: 12,
      }}>
      <div>
        <a href="#">Home</a>
        <a href="#">News</a>
        <a href="#">About</a>
      </div>
    </div>
  );
}

export default Navbar;
