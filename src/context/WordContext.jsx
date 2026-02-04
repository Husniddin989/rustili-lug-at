import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialWords } from '../data/initialWords';
import * as storage from '../utils/storage';
import { initSRSWord } from '../utils/srsHelpers';

const WordContext = createContext();

const ACTIONS = {
  LOAD_WORDS: 'LOAD_WORDS',
  ADD_WORD: 'ADD_WORD',
  UPDATE_WORD: 'UPDATE_WORD',
  DELETE_WORD: 'DELETE_WORD',
  MARK_UNKNOWN: 'MARK_UNKNOWN',
  INCREMENT_REVIEW: 'INCREMENT_REVIEW',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  UPDATE_WORD_SRS: 'UPDATE_WORD_SRS'
};

const wordReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_WORDS:
      return { ...state, words: action.payload.words, progress: action.payload.progress };

    case ACTIONS.ADD_WORD:
      return { ...state, words: [...state.words, action.payload] };

    case ACTIONS.UPDATE_WORD:
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id ? action.payload : word
        )
      };

    case ACTIONS.DELETE_WORD:
      return { ...state, words: state.words.filter(word => word.id !== action.payload) };

    case ACTIONS.MARK_UNKNOWN:
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id
            ? { ...word, isUnknown: action.payload.isUnknown }
            : word
        )
      };

    case ACTIONS.INCREMENT_REVIEW:
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload
            ? { ...word, timesReviewed: word.timesReviewed + 1 }
            : word
        )
      };

    case ACTIONS.UPDATE_PROGRESS:
      return { ...state, progress: { ...state.progress, ...action.payload } };

    case ACTIONS.UPDATE_WORD_SRS:
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id
            ? {
                ...word,
                srsLevel: action.payload.srsLevel,
                nextReview: action.payload.nextReview,
                lastReviewed: action.payload.lastReviewed,
                timesReviewed: (word.timesReviewed || 0) + 1
              }
            : word
        )
      };

    default:
      return state;
  }
};

const initialState = {
  words: [],
  progress: {
    totalWords: 0,
    knownWords: 0,
    unknownWords: 0,
    quizzesTaken: 0,
    lastStudied: null,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null
  }
};

const checkStreak = (progress) => {
  const today = new Date().toDateString();
  const lastStudy = progress.lastStudyDate
    ? new Date(progress.lastStudyDate).toDateString()
    : null;

  if (!lastStudy) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, progress.longestStreak || 0),
      lastStudyDate: new Date().toISOString()
    };
  }

  if (today === lastStudy) return {};

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastStudy === yesterday.toDateString()) {
    const newStreak = (progress.currentStreak || 0) + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak || 0),
      lastStudyDate: new Date().toISOString()
    };
  }

  return {
    currentStreak: 1,
    longestStreak: Math.max(1, progress.longestStreak || 0),
    lastStudyDate: new Date().toISOString()
  };
};

export const WordProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wordReducer, initialState);

  useEffect(() => {
    let words = storage.getWords();
    const validCategories = new Set(['verb', 'noun', 'adjective', 'greeting', 'number', 'phrase']);

    if (!words || words.length === 0) {
      words = initialWords;
      storage.saveWords(words);
    } else {
      // If localStorage has words with invalid categories (e.g. "level1" from old imports), reset to initialWords
      const hasInvalid = words.some(w => !validCategories.has(w.category));
      if (hasInvalid) {
        const initialIds = new Set(initialWords.map(w => w.id));
        // Keep only user-manually-added words (valid category, have both fields, not in initialWords)
        const userOnly = words.filter(w =>
          validCategories.has(w.category) && w.russian && w.uzbek && !initialIds.has(w.id)
        );
        words = [...initialWords, ...userOnly];
        storage.saveWords(words);
      }
    }

    // Migrate words for SRS if needed
    let migrated = false;
    words = words.map(word => {
      if (word.srsLevel === undefined) {
        migrated = true;
        return initSRSWord(word);
      }
      return word;
    });
    if (migrated) storage.saveWords(words);

    let progress = storage.getProgress();

    // Ensure streak fields exist
    if (progress.currentStreak === undefined) {
      progress = { ...progress, currentStreak: 0, longestStreak: 0, lastStudyDate: null };
      storage.saveProgress(progress);
    }

    dispatch({
      type: ACTIONS.LOAD_WORDS,
      payload: { words, progress }
    });
  }, []);

  useEffect(() => {
    if (state.words.length > 0) {
      storage.saveWords(state.words);

      const unknownWords = state.words.filter(w => w.isUnknown).length;
      const totalWords = state.words.length;
      const knownWords = totalWords - unknownWords;

      const newProgress = {
        ...state.progress,
        totalWords,
        knownWords,
        unknownWords
      };

      storage.saveProgress(newProgress);
    }
  }, [state.words]);

  const addWord = (word) => {
    const newWord = {
      ...word,
      srsLevel: 0,
      nextReview: new Date().toISOString(),
      lastReviewed: null
    };
    const saved = storage.addWord(newWord);
    dispatch({ type: ACTIONS.ADD_WORD, payload: saved });
  };

  const updateWord = (wordId, updates) => {
    const updatedWord = storage.updateWord(wordId, updates);
    if (updatedWord) {
      dispatch({ type: ACTIONS.UPDATE_WORD, payload: updatedWord });
    }
  };

  const deleteWord = (wordId) => {
    storage.deleteWord(wordId);
    dispatch({ type: ACTIONS.DELETE_WORD, payload: wordId });
  };

  const markAsUnknown = (wordId, isUnknown) => {
    storage.markAsUnknown(wordId, isUnknown);
    dispatch({ type: ACTIONS.MARK_UNKNOWN, payload: { id: wordId, isUnknown } });
  };

  const incrementReviewCount = (wordId) => {
    storage.incrementReviewCount(wordId);
    dispatch({ type: ACTIONS.INCREMENT_REVIEW, payload: wordId });
  };

  const updateProgress = (updates) => {
    const streakUpdates = updates.lastStudied ? checkStreak(state.progress) : {};
    const allUpdates = { ...updates, ...streakUpdates };
    const newProgress = storage.updateProgress(allUpdates);
    dispatch({ type: ACTIONS.UPDATE_PROGRESS, payload: newProgress });
  };

  const updateWordSRS = (wordId, srsData) => {
    const word = state.words.find(w => w.id === wordId);
    if (word) {
      const updated = {
        ...word,
        srsLevel: srsData.srsLevel,
        nextReview: srsData.nextReview,
        lastReviewed: srsData.lastReviewed,
        timesReviewed: (word.timesReviewed || 0) + 1
      };
      storage.updateWord(wordId, updated);
      dispatch({
        type: ACTIONS.UPDATE_WORD_SRS,
        payload: {
          id: wordId,
          srsLevel: srsData.srsLevel,
          nextReview: srsData.nextReview,
          lastReviewed: srsData.lastReviewed
        }
      });
    }
  };

  const value = {
    words: state.words,
    progress: state.progress,
    addWord,
    updateWord,
    deleteWord,
    markAsUnknown,
    incrementReviewCount,
    updateProgress,
    updateWordSRS
  };

  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export const useWords = () => {
  const context = useContext(WordContext);
  if (!context) {
    throw new Error('useWords must be used within a WordProvider');
  }
  return context;
};
