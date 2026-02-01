import { useState } from 'react';

const Flashcard = ({ word, onKnown, onUnknown }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Flashcard */}
      <div
        className="relative w-full h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side - Russian */}
          <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
              <div className="text-sm font-medium mb-4 opacity-75">
                Rus tilida
              </div>
              <div className="text-5xl font-bold text-center mb-8">
                {word.russian}
              </div>
              <div className="text-sm opacity-75 italic">
                Kartochkani aylantirish uchun bosing
              </div>
            </div>
          </div>

          {/* Back Side - Uzbek */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'}`}>
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
              <div className="text-sm font-medium mb-4 opacity-75">
                O'zbek tilida
              </div>
              <div className="text-4xl font-bold text-center mb-6">
                {word.uzbek}
              </div>

              {word.example && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md text-center">
                  <div className="text-sm mb-2 italic">
                    "{word.example}"
                  </div>
                  <div className="text-sm opacity-90">
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
        <div className="mt-6 flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnknown();
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
          >
            ✗ Bilmadim
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onKnown();
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
          >
            ✓ Bildim
          </button>
        </div>
      )}

      {/* Hint */}
      {!isFlipped && (
        <div className="mt-4 text-center text-gray-600 text-sm">
          Tarjimasini ko'rish uchun kartochkani bosing
        </div>
      )}
    </div>
  );
};

export default Flashcard;
