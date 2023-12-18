'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className='p-2 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className='h-6 w-6 text-gray-800 dark:text-yellow-300' />
      ) : (
        <MoonIcon className='h-6 w-6 text-gray-800 dark:text-gray-200' />
      )}
    </button>
  );
};

export default ThemeToggle;
