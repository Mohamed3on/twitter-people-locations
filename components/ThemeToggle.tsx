// components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className='p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      onClick={toggleTheme}
    >
      {resolvedTheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
