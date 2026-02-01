import { Link, useLocation } from 'react-router-dom';
import { useWords } from '../context/WordContext';

const Navigation = () => {
  const location = useLocation();
  const { progress } = useWords();

  const navItems = [
    { path: '/', label: 'Bosh sahifa', icon: '🏠' },
    { path: '/flashcards', label: 'Kartochkalar', icon: '📇' },
    { path: '/words', label: 'So\'zlar', icon: '📚' },
    { path: '/unknown', label: 'Bilmagan so\'zlar', icon: '❓' },
    { path: '/quiz', label: 'Quiz', icon: '✅' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
            <span>🇷🇺</span>
            <span>Rus Tili</span>
          </Link>

          {/* Progress Badge */}
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              📊 {progress.totalWords} so'z
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full">
              ✓ {progress.knownWords} bildim
            </div>
            <div className="bg-red-100 px-3 py-1 rounded-full">
              ✗ {progress.unknownWords} bilmadim
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                ${
                  isActive(item.path)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
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
