import { useState, useEffect } from 'react';
import { useWords } from '../context/WordContext';
import Flashcard from '../components/Flashcard';
import { shuffleArray } from '../utils/quizHelpers';

const FlashcardsPage = () => {
  const { words, markAsUnknown, incrementReviewCount, updateProgress } = useWords();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sessionStats, setSessionStats] = useState({
    known: 0,
    unknown: 0
  });

  // Initialize shuffled words
  useEffect(() => {
    if (words.length > 0) {
      const filtered = selectedCategory === 'all'
        ? words
        : words.filter(w => w.category === selectedCategory);
      setShuffledWords(shuffleArray(filtered));
      setCurrentIndex(0);
    }
  }, [words, selectedCategory]);

  const currentWord = shuffledWords[currentIndex];

  const handleKnown = () => {
    if (currentWord) {
      markAsUnknown(currentWord.id, false);
      incrementReviewCount(currentWord.id);
      setSessionStats(prev => ({ ...prev, known: prev.known + 1 }));
      handleNext();
    }
  };

  const handleUnknown = () => {
    if (currentWord) {
      markAsUnknown(currentWord.id, true);
      incrementReviewCount(currentWord.id);
      setSessionStats(prev => ({ ...prev, unknown: prev.unknown + 1 }));
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete
      updateProgress({ lastStudied: new Date().toISOString() });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setShuffledWords(shuffleArray(shuffledWords));
    setCurrentIndex(0);
    setSessionStats({ known: 0, unknown: 0 });
  };

  const categories = [...new Set(words.map(w => w.category))].sort();
  const progress = shuffledWords.length > 0
    ? Math.round(((currentIndex + 1) / shuffledWords.length) * 100)
    : 0;

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📇</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          So'zlar yo'q
        </h2>
        <p className="text-gray-600">
          Avval so'zlar qo'shing
        </p>
      </div>
    );
  }

  if (shuffledWords.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📇</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Bu kategoriyada so'z yo'q
        </h2>
        <button
          onClick={() => setSelectedCategory('all')}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Barcha so'zlarni ko'rish
        </button>
      </div>
    );
  }

  const isComplete = currentIndex >= shuffledWords.length - 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📇 Flashcards
        </h1>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hammasi
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Jarayon
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {currentIndex + 1} / {shuffledWords.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">
            {sessionStats.known}
          </div>
          <div className="text-sm text-green-600">
            ✓ Bildim
          </div>
        </div>
        <div className="bg-red-100 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-700">
            {sessionStats.unknown}
          </div>
          <div className="text-sm text-red-600">
            ✗ Bilmadim
          </div>
        </div>
      </div>

      {/* Flashcard */}
      {currentWord && (
        <Flashcard
          key={currentWord.id}
          word={currentWord}
          onKnown={handleKnown}
          onUnknown={handleUnknown}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Oldingi
        </button>
        <button
          onClick={handleNext}
          disabled={isComplete}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Keyingi →
        </button>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          🔄 Qaytadan
        </button>
      </div>

      {/* Complete Message */}
      {isComplete && (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">
            Tabriklaymiz!
          </h2>
          <p className="text-xl mb-6">
            Siz barcha kartochkalarni ko'rib chiqdingiz!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              🔄 Qaytadan boshlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
