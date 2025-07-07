import { NavLink as RouterNavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { 
  MdOutlineSatelliteAlt,
  MdOutlineShowChart, // Telemetry icon
  MdOutlineExplore, // Gyro/Orientation icon
  MdOutlineListAlt,   // Logs icon
  MdLightMode,        // Light mode icon
  MdDarkMode,          // Dark mode icon
  MdOutlineLogout
} from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.primary}55, 
      ${({ theme }) => theme.primary}88
    );
    opacity: 0;
    mix-blend-mode: multiply;
    transition: opacity 0.3s ease;
    z-index: 0;
    border-radius: 12px;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.05);
  }

&.active {
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.primary}, 
    ${({ theme }) => theme.primary}cc
  );
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  svg {
    color: white;
  }
}


  & > * {
    position: relative;
    z-index: 1;
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
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.primary}55, 
      ${({ theme }) => theme.primary}88
    );
    opacity: 0;
    mix-blend-mode: multiply;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.05);
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;



const LogoutButton = styled(ThemeButton)`
  border-color: ${({ theme }) => theme.danger};
  color: ${({ theme }) => theme.danger};

  svg {
    color: ${({ theme }) => theme.danger};
    transition: color 0.3s ease;
  }

  &::before {
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.danger}55, 
      ${({ theme }) => theme.danger}88
    );
    mix-blend-mode: multiply;
  }

  &:hover {
    color: white;

    svg {
      color: white;
    }
  }
`;




const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavContainer>
      <NavBrand>
        <SatelliteIcon />
        <span>Satellite Dashboard</span>
      </NavBrand>
      <NavLinks>
        <StyledNavLink 
          to="/" 
          end
          isActive={(match, location) => match || location.pathname === '/telemetry'}
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
        
        <LogoutButton onClick={handleLogout}>
          <MdOutlineLogout size={18} />
          <span>Logout</span>
        </LogoutButton>

      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;