import React from "react";

import { NavbarContainer as Container } from "./Navbar.styled";

function Navbar() {
  return (
    <Container>
      <a>Home</a>
      <a>Project</a>
      <a>Blog</a>
    </Container>
  );
}

export default Navbar;
