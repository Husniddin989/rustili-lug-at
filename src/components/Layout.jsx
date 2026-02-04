import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'}>
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
