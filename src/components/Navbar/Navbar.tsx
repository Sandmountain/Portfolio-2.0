import React from "react";

import { NavbarContainer as Container } from "./Navbar.styled";

function Navbar() {
  return (
    <Container>
      <a href="#">Home</a>
      <a href="#">News</a>
      <a href="#">About</a>
    </Container>
  );
}

export default Navbar;
