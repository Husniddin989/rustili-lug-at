import { useState } from 'react';

const Flashcard = ({ word, onKnown, onUnknown }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Flashcard */}
      <div
        className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side - Russian */}
          <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-white">
              <div className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-75">
                Rus tilida
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 break-words max-w-full px-2">
                {word.russian}
              </div>
              <div className="text-xs sm:text-sm opacity-75 italic">
                Kartochkani aylantirish uchun bosing
              </div>
            </div>
          </div>

          {/* Back Side - Uzbek */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'}`}>
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-white">
              <div className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-75">
                O'zbek tilida
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 break-words max-w-full px-2">
                {word.uzbek}
              </div>

              {word.example && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 max-w-md text-center">
                  <div className="text-xs sm:text-sm mb-2 italic break-words">
                    "{word.example}"
                  </div>
                  <div className="text-xs sm:text-sm opacity-90 break-words">
                    "{word.exampleTranslation}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isFlipped && (
        <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnknown();
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-colors shadow-lg"
          >
            ✗ Bilmadim
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onKnown();
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-colors shadow-lg"
          >
            ✓ Bildim
          </button>
        </div>
      )}

      {/* Hint */}
      {!isFlipped && (
        <div className="mt-3 sm:mt-4 text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Tarjimasini ko'rish uchun kartochkani bosing
        </div>
      )}
    </div>
  );
};

export default Flashcard;
