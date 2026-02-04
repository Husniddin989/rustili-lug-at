const SRS_INTERVALS = [0, 1, 3, 7, 14, 30];

export const initSRSWord = (word) => {
  if (word.srsLevel !== undefined) return word;
  return {
    ...word,
    srsLevel: 0,
    nextReview: new Date().toISOString(),
    lastReviewed: null
  };
};

export const updateSRSWord = (word, isCorrect) => {
  const now = new Date();
  const newLevel = isCorrect ? Math.min((word.srsLevel || 0) + 1, 5) : 0;
  const intervalDays = SRS_INTERVALS[newLevel];
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return {
    ...word,
    srsLevel: newLevel,
    nextReview: nextReview.toISOString(),
    lastReviewed: now.toISOString()
  };
};

export const getDueWords = (words) => {
  const now = new Date();
  return words.filter(word => {
    if (word.srsLevel === undefined) return true;
    if (!word.nextReview) return true;
    return new Date(word.nextReview) <= now;
  });
};

export const getSRSLevelLabel = (level) => {
  const labels = ['Yangi', '1 kun', '3 kun', 'Hafta', '2 hafta', 'Oy'];
  return labels[level] || 'Yangi';
};
