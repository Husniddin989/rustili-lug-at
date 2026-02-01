import { Link } from 'react-router-dom';
import { useWords } from '../context/WordContext';
import { getCategories } from '../utils/quizHelpers';

const Home = () => {
  const { words, progress } = useWords();
  const categories = getCategories(words);

  const quickLinks = [
    {
      to: '/flashcards',
      title: 'Kartochkalar',
      description: 'So\'zlarni flashcard ko\'rinishida o\'rganing',
      icon: '📇',
      color: 'bg-blue-500'
    },
    {
      to: '/words',
      title: 'So\'zlar ro\'yxati',
      description: 'Barcha so\'zlarni ko\'rish va tahrirlash',
      icon: '📚',
      color: 'bg-green-500'
    },
    {
      to: '/unknown',
      title: 'Bilmagan so\'zlar',
      description: 'Qiyin so\'zlarni qayta mashq qilish',
      icon: '❓',
      color: 'bg-red-500'
    },
    {
      to: '/quiz',
      title: 'Quiz',
      description: 'Bilimingizni tekshiring',
      icon: '✅',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    {
      label: 'Jami so\'zlar',
      value: progress.totalWords,
      icon: '📖',
      color: 'text-blue-600'
    },
    {
      label: 'Bildim',
      value: progress.knownWords,
      icon: '✓',
      color: 'text-green-600'
    },
    {
      label: 'Bilmadim',
      value: progress.unknownWords,
      icon: '✗',
      color: 'text-red-600'
    },
    {
      label: 'Quizlar',
      value: progress.quizzesTaken,
      icon: '🎯',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-4">
          Xush kelibsiz! 🇷🇺
        </h1>
        <p className="text-xl opacity-90 mb-6">
          Rus tilini o'rganish platformasi
        </p>
        <p className="text-lg opacity-75">
          {progress.totalWords} ta so'z bilan interaktiv mashqlar qiling
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className={`text-4xl mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Nimadan boshlaysiz?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className={`${link.color} text-white text-4xl p-4 rounded-xl`}>
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {link.title}
                  </h3>
                  <p className="text-gray-600">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Kategoriyalar
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => {
            const categoryWords = words.filter(w => w.category === category);
            const categoryIcons = {
              greeting: '👋',
              verb: '🏃',
              noun: '🏠',
              adjective: '🎨',
              number: '🔢',
              phrase: '💬'
            };

            return (
              <div
                key={index}
                className="bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 rounded-lg"
              >
                <span className="mr-2">{categoryIcons[category] || '📝'}</span>
                <span className="font-medium text-gray-800 capitalize">
                  {category}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  ({categoryWords.length})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Studied */}
      {progress.lastStudied && (
        <div className="bg-indigo-50 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Oxirgi mashq: {' '}
            <span className="font-medium text-indigo-600">
              {new Date(progress.lastStudied).toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
