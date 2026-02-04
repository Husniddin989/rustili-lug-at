import { useState } from 'react';
import { useWords } from '../context/WordContext';
import { generateQuizQuestions, calculateScore, checkAnswer } from '../utils/quizHelpers';

const QuizPage = () => {
  const { words, progress, updateProgress } = useWords();
  const [quizState, setQuizState] = useState('setup');
  const [quizMode, setQuizMode] = useState('ru-uz');
  const [quizType, setQuizType] = useState('multiple');
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState(null);
  const [typingAnswer, setTypingAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const startQuiz = () => {
    try {
      const quizQuestions = generateQuizQuestions(words, questionCount, quizMode);
      setQuestions(quizQuestions);
      setQuizState('quiz');
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedAnswer(null);
      setTypingAnswer('');
      setFeedback(null);
    } catch (error) {
      alert('Quiz boshlashda xatolik: ' + error.message);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const advanceOrFinish = (newAnswers) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTypingAnswer('');
      setFeedback(null);
    } else {
      const score = calculateScore(newAnswers, questions);
      setResults(score);
      setQuizState('results');
      updateProgress({
        quizzesTaken: (progress.quizzesTaken || 0) + 1,
        lastStudied: new Date().toISOString()
      });
    }
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...userAnswers, selectedAnswer];
      setUserAnswers(newAnswers);
      advanceOrFinish(newAnswers);
    }
  };

  const handleTypingSubmit = () => {
    if (!typingAnswer.trim()) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = checkAnswer(typingAnswer, currentQuestion.correctAnswer);
    setFeedback({ isCorrect, correctAnswer: currentQuestion.correctAnswer });
  };

  const handleTypingNext = () => {
    const newAnswers = [...userAnswers, typingAnswer];
    setUserAnswers(newAnswers);
    setTypingAnswer('');
    setFeedback(null);
    advanceOrFinish(newAnswers);
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setResults(null);
    setTypingAnswer('');
    setFeedback(null);
  };

  if (quizState === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">✅ Quiz</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Savollar turli
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizType('multiple')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizType === 'multiple'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">📋 Ko'p variant</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">4 variantdan tanlang</div>
                </button>
                <button
                  onClick={() => setQuizType('typing')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizType === 'typing'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">⌨️ Tiping</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Javobni yozing</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quiz rejimi
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizMode('ru-uz')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizMode === 'ru-uz'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">🇷🇺 → 🇽🇿</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rus savol, O'zbek javob</div>
                </button>
                <button
                  onClick={() => setQuizMode('uz-ru')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizMode === 'uz-ru'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">🇽🇿 → 🇷🇺</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">O'zbek savol, Rus javob</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>5</span>
                <span>{Math.min(words.length, 30)}</span>
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={words.length < 4}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quizni boshlash
            </button>

            {words.length < 4 && (
              <p className="text-center text-red-600 text-sm">Quiz uchun kamida 4 ta so'z kerak</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">ℹ️ Qanday ishlaydi?</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {quizType === 'multiple' ? (
              <>
                <li>• Har bir savolda 4 ta variant bo'ladi</li>
                <li>• Faqat bitta to'g'ri javob tanlang</li>
              </>
            ) : (
              <>
                <li>• Javobni o'z kelat yozing</li>
                <li>• Harf tarkibi (case) hisobga olinmaydi</li>
              </>
            )}
            <li>• Oxirida natijalaringizni ko'rasiz</li>
            <li>• Xatolor bilan birga to'g'ri javoblar ko'rsatiladi</li>
          </ul>
        </div>
      </div>
    );
  }

  if (quizState === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];
    const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    const categoryLabels = {
      greeting: 'Salomlashish',
      verb: "Fe'l",
      noun: 'Ot',
      adjective: 'Sifat',
      number: 'Raqam',
      phrase: 'Ibora'
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Savol {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {categoryLabels[currentQuestion.category] || currentQuestion.category}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
            {currentQuestion.question}
          </h2>

          {quizType === 'multiple' ? (
            <>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedAnswer === option
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-400 dark:border-gray-500'
                      }`}>
                        {selectedAnswer === option && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-lg text-gray-800 dark:text-gray-100">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Keyingi savol →' : 'Tugatish'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={typingAnswer}
                onChange={(e) => setTypingAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !feedback) handleTypingSubmit();
                  else if (e.key === 'Enter' && feedback) handleTypingNext();
                }}
                disabled={!!feedback}
                placeholder="Javobni yozing..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-70"
                autoFocus
              />
              {feedback && (
                <div className={`p-4 rounded-lg text-center ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700' : 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700'}`}>
                  <div className={`text-lg font-bold mb-1 ${feedback.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {feedback.isCorrect ? "✓ To'g'ri!" : "✗ Xato!"}
                  </div>
                  {!feedback.isCorrect && (
                    <div className="text-sm text-green-700 dark:text-green-300">
                      To'g'ri javob: <span className="font-bold">{feedback.correctAnswer}</span>
                    </div>
                  )}
                </div>
              )}
              {!feedback ? (
                <button
                  onClick={handleTypingSubmit}
                  disabled={!typingAnswer.trim()}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Javob
                </button>
              ) : (
                <button
                  onClick={handleTypingNext}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Keyingi savol →' : 'Tugatish'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizState === 'results' && results) {
    const percentageColor =
      results.percentage >= 80 ? 'text-green-600' :
      results.percentage >= 60 ? 'text-yellow-600' :
      'text-red-600';

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md text-center">
          <div className="text-6xl mb-4">
            {results.percentage >= 80 ? '🏆' : results.percentage >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz tugadi!</h2>
          <div className={`text-6xl font-bold mb-4 ${percentageColor}`}>
            {results.percentage}%
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{results.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Jami</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{results.correct}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">To'g'ri</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">{results.wrong}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Xato</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Batafsil natijalar</h3>
          <div className="space-y-4">
            {results.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'border-green-300 bg-green-50 dark:bg-green-900 dark:border-green-700'
                    : 'border-red-300 bg-red-50 dark:bg-red-900 dark:border-red-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {index + 1}. {result.question}
                    </div>
                    <div className={`text-sm ${result.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      Sizning javobingiz: {result.userAnswer}
                    </div>
                    {!result.isCorrect && (
                      <div className="text-sm text-green-700 dark:text-green-300">
                        To'g'ri javob: {result.correctAnswer}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl">
                    {result.isCorrect ? '✅' : '❌'}
                  </div>
                </div>
                {result.example && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                    {result.example}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
