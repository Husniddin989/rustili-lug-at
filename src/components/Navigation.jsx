import { Link, useLocation } from 'react-router-dom';
import { useWords } from '../context/WordContext';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const location = useLocation();
  const { progress } = useWords();
  const { darkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { path: '/', label: 'Bosh sahifa', icon: '🏠' },
    { path: '/flashcards', label: 'Kartochkalar', icon: '📇' },
    { path: '/words', label: "So'zlar", icon: '📚' },
    { path: '/unknown', label: "Bilmagan so'zlar", icon: '❓' },
    { path: '/quiz', label: 'Quiz', icon: '✅' },
    { path: '/review', label: 'SRS', icon: '🔁' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            <span>🇷🇺</span>
            <span>Rus Tili</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-sm">
              {(progress.currentStreak || 0) > 0 && (
                <div className="bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded-full text-orange-700 dark:text-orange-300 font-medium">
                  🔥 {progress.currentStreak} kun
                </div>
              )}
              <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-blue-700 dark:text-blue-300">
                📊 {progress.totalWords} so'z
              </div>
              <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full text-green-700 dark:text-green-300">
                ✓ {progress.knownWords} bildim
              </div>
              <div className="bg-red-100 dark:bg-red-900 px-3 py-1 rounded-full text-red-700 dark:text-red-300">
                ✗ {progress.unknownWords} bilmadim
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
