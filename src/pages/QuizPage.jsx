import { useState } from 'react';
import { useWords } from '../context/WordContext';
import { generateQuizQuestions, calculateScore } from '../utils/quizHelpers';

const QuizPage = () => {
  const { words, updateProgress } = useWords();
  const [quizState, setQuizState] = useState('setup'); // 'setup', 'quiz', 'results'
  const [quizMode, setQuizMode] = useState('ru-uz'); // 'ru-uz' or 'uz-ru'
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState(null);

  const startQuiz = () => {
    try {
      const quizQuestions = generateQuizQuestions(words, questionCount, quizMode);
      setQuestions(quizQuestions);
      setQuizState('quiz');
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedAnswer(null);
    } catch (error) {
      alert('Quiz boshlashda xatolik: ' + error.message);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...userAnswers, selectedAnswer];
      setUserAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz finished
        const score = calculateScore(newAnswers, questions);
        setResults(score);
        setQuizState('results');
        updateProgress({
          quizzesTaken: (updateProgress.quizzesTaken || 0) + 1
        });
      }
    }
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setResults(null);
  };

  // Setup Screen
  if (quizState === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            ✅ Quiz
          </h1>

          <div className="space-y-6">
            {/* Quiz Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quiz rejimi
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizMode('ru-uz')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizMode === 'ru-uz'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-800 mb-1">
                    🇷🇺 → 🇺🇿
                  </div>
                  <div className="text-sm text-gray-600">
                    Rus savol, O'zbek javob
                  </div>
                </button>
                <button
                  onClick={() => setQuizMode('uz-ru')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizMode === 'uz-ru'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-800 mb-1">
                    🇺🇿 → 🇷🇺
                  </div>
                  <div className="text-sm text-gray-600">
                    O'zbek savol, Rus javob
                  </div>
                </button>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Savollar soni: {questionCount}
              </label>
              <input
                type="range"
                min="5"
                max={Math.min(words.length, 30)}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5</span>
                <span>{Math.min(words.length, 30)}</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startQuiz}
              disabled={words.length < 4}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quizni boshlash
            </button>

            {words.length < 4 && (
              <p className="text-center text-red-600 text-sm">
                Quiz uchun kamida 4 ta so'z kerak
              </p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">ℹ️ Qanday ishlaydi?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Har bir savolda 4 ta variant bo'ladi</li>
            <li>• Faqat bitta to'g'ri javob tanlang</li>
            <li>• Oxirida natijalaringizni ko'rasiz</li>
            <li>• Xatolar bilan birga to'g'ri javoblar ko'rsatiladi</li>
          </ul>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (quizState === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Savol {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="text-sm text-gray-500 mb-2 capitalize">
            {currentQuestion.category}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAnswer === option
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Keyingi savol →' : 'Tugatish'}
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizState === 'results' && results) {
    const percentageColor =
      results.percentage >= 80 ? 'text-green-600' :
      results.percentage >= 60 ? 'text-yellow-600' :
      'text-red-600';

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score */}
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <div className="text-6xl mb-4">
            {results.percentage >= 80 ? '🏆' : results.percentage >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz tugadi!
          </h2>
          <div className={`text-6xl font-bold mb-4 ${percentageColor}`}>
            {results.percentage}%
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {results.total}
              </div>
              <div className="text-sm text-gray-600">Jami</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {results.correct}
              </div>
              <div className="text-sm text-gray-600">To'g'ri</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {results.wrong}
              </div>
              <div className="text-sm text-gray-600">Xato</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Batafsil natijalar
          </h3>
          <div className="space-y-4">
            {results.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 mb-1">
                      {index + 1}. {result.question}
                    </div>
                    <div className={`text-sm ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      Sizning javobingiz: {result.userAnswer}
                    </div>
                    {!result.isCorrect && (
                      <div className="text-sm text-green-700">
                        To'g'ri javob: {result.correctAnswer}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl">
                    {result.isCorrect ? '✅' : '❌'}
                  </div>
                </div>
                {result.example && (
                  <div className="text-sm text-gray-600 italic mt-2 pl-4 border-l-2 border-gray-300">
                    {result.example}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleRestart}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
          >
            🔄 Yangi quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizPage;
