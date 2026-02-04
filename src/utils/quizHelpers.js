// Quiz utility functions

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate quiz questions from words
export const generateQuizQuestions = (words, count = 10, mode = 'ru-uz') => {
  const validWords = words.filter(w => w.russian && w.uzbek);
  if (validWords.length < 4) {
    throw new Error('Need at least 4 words to generate quiz');
  }

  const shuffledWords = shuffleArray(validWords);
  const selectedWords = shuffledWords.slice(0, Math.min(count, validWords.length));

  return selectedWords.map((word) => {
    // Get 3 random wrong answers
    const wrongAnswers = validWords
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Prepare question based on mode
    let question, correctAnswer, options;

    if (mode === 'ru-uz') {
      // Russian question, Uzbek answers
      question = word.russian;
      correctAnswer = word.uzbek;
      options = shuffleArray([
        word.uzbek,
        ...wrongAnswers.map(w => w.uzbek)
      ]);
    } else {
      // Uzbek question, Russian answers
      question = word.uzbek;
      correctAnswer = word.russian;
      options = shuffleArray([
        word.russian,
        ...wrongAnswers.map(w => w.russian)
      ]);
    }

    return {
      id: word.id,
      question,
      correctAnswer,
      options,
      category: word.category,
      example: word.example,
      exampleTranslation: word.exampleTranslation
    };
  });
};

// Check if answer is correct
export const checkAnswer = (userAnswer, correctAnswer) => {
  return (userAnswer || '').trim().toLowerCase() === (correctAnswer || '').trim().toLowerCase();
};

// Calculate quiz score
export const calculateScore = (answers, questions) => {
  let correct = 0;
  let wrong = 0;
  const results = [];

  questions.forEach((question, index) => {
    const isCorrect = checkAnswer(answers[index], question.correctAnswer);
    if (isCorrect) {
      correct++;
    } else {
      wrong++;
    }

    results.push({
      question: question.question,
      userAnswer: answers[index],
      correctAnswer: question.correctAnswer,
      isCorrect,
      category: question.category,
      example: question.example
    });
  });

  return {
    correct,
    wrong,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
    results
  };
};

// Get random words by category
export const getWordsByCategory = (words, category) => {
  return words.filter(word => word.category === category);
};

// Get all unique categories
export const getCategories = (words) => {
  const categories = words.map(word => word.category);
  return [...new Set(categories)];
};
