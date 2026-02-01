import { useState } from 'react';
import { useWords } from '../context/WordContext';
import Flashcard from '../components/Flashcard';
import WordCard from '../components/WordCard';

const UnknownWordsPage = () => {
  const { words, markAsUnknown, incrementReviewCount } = useWords();
  const [viewMode, setViewMode] = useState('flashcard'); // 'flashcard' or 'list'
  const [currentIndex, setCurrentIndex] = useState(0);

  const unknownWords = words.filter(w => w.isUnknown);
  const currentWord = unknownWords[currentIndex];

  const handleKnown = () => {
    if (currentWord) {
      markAsUnknown(currentWord.id, false);
      incrementReviewCount(currentWord.id);
      if (currentIndex < unknownWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const handleUnknown = () => {
    if (currentWord) {
      incrementReviewCount(currentWord.id);
      if (currentIndex < unknownWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < unknownWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (unknownWords.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ajoyib!
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Sizda bilmagan so'zlar yo'q!
        </p>
        <p className="text-gray-500">
          Flashcards yoki Quiz bo'limida yangi so'zlarni mashq qiling va
          "Bilmadim" tugmasini bosing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              ❓ Bilmagan so'zlar
            </h1>
            <p className="text-gray-600 mt-2">
              {unknownWords.length} ta so'zni qayta mashq qilishingiz kerak
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('flashcard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'flashcard'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📇 Flashcard
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Ro'yxat
            </button>
          </div>
        </div>

        {/* Progress (Flashcard mode only) */}
        {viewMode === 'flashcard' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Jarayon
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {currentIndex + 1} / {unknownWords.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-orange-600 h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / unknownWords.length) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Flashcard View */}
      {viewMode === 'flashcard' && currentWord && (
        <div className="space-y-6">
          <Flashcard
            key={currentWord.id}
            word={currentWord}
            onKnown={handleKnown}
            onUnknown={handleUnknown}
          />

          {/* Navigation */}
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
              disabled={currentIndex >= unknownWords.length - 1}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Keyingi →
            </button>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unknownWords.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-2">💡 Maslahat</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• So'zlarni bir necha marta qayta ko'rib chiqing</li>
          <li>• "Bildim" tugmasini bosganingizda so'z ro'yxatdan chiqadi</li>
          <li>• Misol jumlalarni o'qib, kontekstda tushunishga harakat qiling</li>
          <li>• Har kuni 10-15 daqiqa mashq qilish yaxshi natija beradi</li>
        </ul>
      </div>
    </div>
  );
};

export default UnknownWordsPage;
