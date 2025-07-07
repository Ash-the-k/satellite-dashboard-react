import { NavLink as RouterNavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { 
  MdOutlineSatelliteAlt,
  MdOutlineShowChart, // Telemetry icon
  MdOutlineExplore, // Gyro/Orientation icon
  MdOutlineListAlt,   // Logs icon
  MdLightMode,        // Light mode icon
  MdDarkMode          // Dark mode icon
} from "react-icons/md";

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.navbarBg};
  color: ${({ theme }) => theme.navbarText};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavBrand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SatelliteIcon = styled(MdOutlineSatelliteAlt)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.primary};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(15deg);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavLinkContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledNavLink = styled(RouterNavLink)`
  color: ${({ theme }) => theme.navbarText};
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.navbarHoverBg || 'rgba(255, 255, 255, 0.1)'};
  }

  &.active {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    svg {
      color: white;
    }
  }
`;

const ThemeButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.navbarText};
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary}20;
  }
`;

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <NavContainer>
      <NavBrand>
        <SatelliteIcon />
        <span>Satellite Dashboard</span>
      </NavBrand>
      <NavLinks>
        <StyledNavLink 
          to="/telemetry" 
          end
          isActive={(match, location) => match || location.pathname === '/'}
        >
          <NavLinkContent>
            <MdOutlineShowChart size={20} />
            <span>Telemetry</span>
          </NavLinkContent>
        </StyledNavLink>
        
        <StyledNavLink to="/gyro">
          <NavLinkContent>
            <MdOutlineExplore size={20} />
            <span>Orientation</span>
          </NavLinkContent>
        </StyledNavLink>
        
        <StyledNavLink to="/logs">
          <NavLinkContent>
            <MdOutlineListAlt size={20} />
            <span>Logs</span>
          </NavLinkContent>
        </StyledNavLink>
        
        <ThemeButton onClick={toggleTheme}>
          {isDark ? (
            <>
              <MdLightMode size={18} />
              <span>Light</span>
            </>
          ) : (
            <>
              <MdDarkMode size={18} />
              <span>Dark</span>
            </>
          )}
        </ThemeButton>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;