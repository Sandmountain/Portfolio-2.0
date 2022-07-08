import React from "react";

import Link from "next/link";

import { Avatar, Box, Divider, Typography, useTheme } from "@mui/material";

// import { NavbarContainer as Container } from "./Navbar.styled";

function Navbar() {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",

        gap: 6,
        alignItems: "center",
        height: "50px",
        color: "white",
        padding: 12,
      }}>
      <Link href="/">
        <Box component="div" sx={{ display: "flex", alignItems: "center", marginRight: "auto", cursor: "pointer" }}>
          <Avatar
            component="div"
            src="http://localhost:3000/_next/image?url=http%3A%2F%2Fimages.ctfassets.net%2Fpesye57ju1o0%2F6lYyNcTJcDY6yqWvy0jh7L%2Fd69f47794544c1f3ca3197b186d2d6e1%2Flogo.png&w=640&q=75"
            sx={{ width: 24, height: 24, marginRight: theme.spacing(1) }}
          />
          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} />
          <Box component="div" sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Typography variant="caption" lineHeight={1} sx={{ ml: theme.spacing(1) }}>
              viktorsandberg.com
            </Typography>
            <Typography variant="caption" lineHeight={1} fontSize={8} sx={{ ml: theme.spacing(1) }}>
              a portfolio page
            </Typography>
          </Box>
        </Box>
      </Link>
      <Box component="div" sx={{ display: "flex", gap: 2 }}>
        <a href="/portfolio">Home</a>
        <a href="#">News</a>
        <a href="#">About</a>
      </Box>
    </div>
  );
}

export default Navbar;
