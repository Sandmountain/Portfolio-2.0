import React from "react";

import Link from "next/link";

import { Avatar, Box, Divider, Typography, useTheme } from "@mui/material";

// import { NavbarContainer as Container } from "./Navbar.styled";

function Navbar() {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: 6,
        alignItems: "center",
        height: "50px",
        color: "white",
        padding: 12,
        zIndex: 2,
      }}>
      <Link href="/">
        <Box component="div" sx={{ display: "flex", alignItems: "center", marginRight: "auto", cursor: "pointer" }}>
          <Avatar
            component="div"
            src="./logo.png"
            sx={{
              width: 24,
              height: 24,
              marginRight: theme.spacing(1),
            }}
          />

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} />
          <Box component="div" sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Typography variant="overline" lineHeight={1} sx={{ ml: theme.spacing(1) }}>
              ViktorSandberg
              <Typography variant="caption" sx={{ fontSize: 7 }}>
                .com
              </Typography>
            </Typography>
            <Typography variant="caption" lineHeight={1} fontSize={8} sx={{ ml: theme.spacing(1) }}>
              a portfolio page
            </Typography>
          </Box>
        </Box>
      </Link>
      <Box component="div" sx={{ display: "flex", gap: 2 }}>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/about">About</Link>
        <Link href="/career">Career</Link>
      </Box>
    </div>
  );
}

export default Navbar;
