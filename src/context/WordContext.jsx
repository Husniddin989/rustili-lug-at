import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialWords } from '../data/initialWords';
import * as storage from '../utils/storage';

// Create context
const WordContext = createContext();

// Action types
const ACTIONS = {
  LOAD_WORDS: 'LOAD_WORDS',
  ADD_WORD: 'ADD_WORD',
  UPDATE_WORD: 'UPDATE_WORD',
  DELETE_WORD: 'DELETE_WORD',
  MARK_UNKNOWN: 'MARK_UNKNOWN',
  INCREMENT_REVIEW: 'INCREMENT_REVIEW',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS'
};

// Reducer
const wordReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_WORDS:
      return {
        ...state,
        words: action.payload.words,
        progress: action.payload.progress
      };

    case ACTIONS.ADD_WORD:
      return {
        ...state,
        words: [...state.words, action.payload]
      };

    case ACTIONS.UPDATE_WORD:
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id ? action.payload : word
        )
      };

    case ACTIONS.DELETE_WORD:
      return {
        ...state,
        words: state.words.filter(word => word.id !== action.payload)
      };

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
      return {
        ...state,
        progress: { ...state.progress, ...action.payload }
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  words: [],
  progress: {
    totalWords: 0,
    knownWords: 0,
    unknownWords: 0,
    quizzesTaken: 0,
    lastStudied: null
  }
};

// Provider component
export const WordProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wordReducer, initialState);

  // Load words from localStorage on mount
  useEffect(() => {
    let words = storage.getWords();

    // If no words in storage, use initial words
    if (!words || words.length === 0) {
      words = initialWords;
      storage.saveWords(words);
    }

    const progress = storage.getProgress();

    dispatch({
      type: ACTIONS.LOAD_WORDS,
      payload: { words, progress }
    });
  }, []);

  // Save words to localStorage whenever they change
  useEffect(() => {
    if (state.words.length > 0) {
      storage.saveWords(state.words);

      // Update progress
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

  // Actions
  const addWord = (word) => {
    const newWord = storage.addWord(word);
    dispatch({ type: ACTIONS.ADD_WORD, payload: newWord });
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
    const newProgress = storage.updateProgress(updates);
    dispatch({ type: ACTIONS.UPDATE_PROGRESS, payload: newProgress });
  };

  const value = {
    words: state.words,
    progress: state.progress,
    addWord,
    updateWord,
    deleteWord,
    markAsUnknown,
    incrementReviewCount,
    updateProgress
  };

  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

// Custom hook to use the context
export const useWords = () => {
  const context = useContext(WordContext);
  if (!context) {
    throw new Error('useWords must be used within a WordProvider');
  }
  return context;
};
