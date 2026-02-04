import { Link } from 'react-router-dom';
import { useWords } from '../context/WordContext';
import { getCategories } from '../utils/quizHelpers';
import { getDueWords } from '../utils/srsHelpers';

const Home = () => {
  const { words, progress } = useWords();
  const categories = getCategories(words);
  const dueCount = getDueWords(words).length;

  const quickLinks = [
    {
      to: '/flashcards',
      title: 'Kartochkalar',
      description: "So'zlarni flashcard ko'rinishida o'rganing",
      icon: '📇',
      color: 'bg-blue-500'
    },
    {
      to: '/words',
      title: "So'zlar ro'yxati",
      description: "Barcha so'zlarni ko'rish va tahrirlash",
      icon: '📚',
      color: 'bg-green-500'
    },
    {
      to: '/unknown',
      title: "Bilmagan so'zlar",
      description: "Qiyin so'zlarni qayta mashq qilish",
      icon: '❓',
      color: 'bg-red-500'
    },
    {
      to: '/quiz',
      title: 'Quiz',
      description: 'Bilimingizni tekshiring',
      icon: '✅',
      color: 'bg-purple-500'
    },
    {
      to: '/review',
      title: 'SRS Takrar mashq',
      description: dueCount + " so'z bugun mashq uchun",
      icon: '🔁',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: "Jami so'zlar", value: progress.totalWords, icon: '📖', color: 'text-blue-600' },
    { label: 'Bildim', value: progress.knownWords, icon: '✓', color: 'text-green-600' },
    { label: 'Bilmadim', value: progress.unknownWords, icon: '✗', color: 'text-red-600' },
    { label: 'Quizlar', value: progress.quizzesTaken, icon: '🎯', color: 'text-purple-600' }
  ];

  const categoryIcons = {
    greeting: '👋',
    verb: '🏃',
    noun: '🏠',
    adjective: '🎨',
    number: '🔢',
    phrase: '💬'
  };

  const categoryLabels = {
    greeting: 'Salomlashish',
    verb: "Fe'l",
    noun: 'Ot',
    adjective: 'Sifat',
    number: 'Raqam',
    phrase: 'Ibora'
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          Xush kelibsiz! 🇷🇺
        </h1>
        <p className="text-lg sm:text-xl opacity-90 mb-4 sm:mb-6">
          Rus tilini o'rganish platformasi
        </p>
        <p className="text-base sm:text-lg opacity-75">
          {progress.totalWords} ta so'z bilan interaktiv mashqlar qiling
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="text-3xl sm:text-4xl mb-1">🔥</div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {progress.currentStreak || 0}
          </div>
          <div className="text-xs sm:text-sm opacity-90">Kun streak</div>
          {(progress.longestStreak || 0) > 0 && (
            <div className="text-xs opacity-75 mt-1">
              Eng uzun: {progress.longestStreak}
            </div>
          )}
        </div>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className={`text-3xl sm:text-4xl mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Nimadan boshlaysiz?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`${link.color} text-white text-3xl sm:text-4xl p-3 sm:p-4 rounded-xl flex-shrink-0`}>
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Kategoriyalar
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => {
            const categoryWords = words.filter(w => w.category === category);
            return (
              <div
                key={index}
                className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 px-4 py-2 rounded-lg"
              >
                <span className="mr-2">{categoryIcons[category] || '📝'}</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {categoryLabels[category] || category}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  ({categoryWords.length})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {progress.lastStudied && (
        <div className="bg-indigo-50 dark:bg-indigo-900 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Oxirgi mashq: {' '}
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
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
