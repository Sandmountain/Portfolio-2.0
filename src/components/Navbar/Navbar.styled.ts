import styled from "styled-components";

import { ThemeType } from "../../theme/theme";

interface DefaultTheme {
  theme: ThemeType;
}

export const NavbarContainer = styled.div<DefaultTheme>`
  display: flex;
  justify-content: flex-end;
  padding: ${props => props.theme.padding.lg};
  background-color: ${props => props.theme.palette.white}05;
  gap: ${props => props.theme.padding.lg};
  color: ${props => props.theme.palette.white};
`;
