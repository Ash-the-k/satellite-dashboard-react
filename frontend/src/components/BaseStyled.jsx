import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const StyledBase = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  transition: all 0.3s ease;
`;

export const BaseStyled = ({ children }) => {
  const { theme } = useTheme();
  return <StyledBase theme={theme}>{children}</StyledBase>;
};