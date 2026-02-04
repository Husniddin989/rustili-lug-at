import { useState, useEffect } from 'react';
import { useWords } from '../context/WordContext';
import Flashcard from '../components/Flashcard';
import { getDueWords, updateSRSWord, getSRSLevelLabel } from '../utils/srsHelpers';

const ReviewPage = () => {
  const { words, updateWordSRS, updateProgress } = useWords();
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (words.length > 0 && !initialized) {
      setDueWords(getDueWords(words));
      setInitialized(true);
    }
  }, [words, initialized]);

  const currentWord = dueWords[currentIndex];

  const handleKnown = () => {
    if (!currentWord) return;
    const updated = updateSRSWord(currentWord, true);
    updateWordSRS(currentWord.id, updated);
    setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    advanceOrFinish();
  };

  const handleUnknown = () => {
    if (!currentWord) return;
    const updated = updateSRSWord(currentWord, false);
    updateWordSRS(currentWord.id, updated);
    setSessionStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    advanceOrFinish();
  };

  const advanceOrFinish = () => {
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      updateProgress({ lastStudied: new Date().toISOString() });
    }
  };

  const handleRestart = () => {
    setDueWords(getDueWords(words));
    setCurrentIndex(0);
    setSessionStats({ correct: 0, wrong: 0 });
    setIsComplete(false);
  };

  if (dueWords.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Bugungi mashq tugadi!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Barcha so'zlar ko'rib chiqilgan. Ertaga yangilari paydo bo'ladi.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Tabriklaymiz!</h2>
          <p className="text-xl mb-6">
            Siz {dueWords.length} so'zni ko'rib chiqdi!
          </p>
          <div className="flex gap-4 justify-center mb-6">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">✓ {sessionStats.correct}</div>
              <div className="text-sm opacity-90">To'g'ri</div>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">✗ {sessionStats.wrong}</div>
              <div className="text-sm opacity-90">Xato</div>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            🔄 Qaytadan
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentIndex + 1) / dueWords.length) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🔁 Takrar mashq (SRS)
          </h1>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {currentIndex + 1} / {dueWords.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        {currentWord && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
              SRS: {getSRSLevelLabel(currentWord.srsLevel || 0)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentWord.timesReviewed || 0} marta ko'rib chiqilgan
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 dark:bg-green-900 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700 dark:text-green-300">{sessionStats.correct}</div>
          <div className="text-sm text-green-600 dark:text-green-400">✓ To'g'ri</div>
        </div>
        <div className="bg-red-100 dark:bg-red-900 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-700 dark:text-red-300">{sessionStats.wrong}</div>
          <div className="text-sm text-red-600 dark:text-red-400">✗ Xato</div>
        </div>
      </div>

      {currentWord && (
        <Flashcard
          key={currentWord.id}
          word={currentWord}
          onKnown={handleKnown}
          onUnknown={handleUnknown}
        />
      )}
    </div>
  );
};

export default ReviewPage;
