import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;