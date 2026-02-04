import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WordProvider } from './context/WordContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import FlashcardsPage from './pages/FlashcardsPage';
import WordsPage from './pages/WordsPage';
import UnknownWordsPage from './pages/UnknownWordsPage';
import QuizPage from './pages/QuizPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <ThemeProvider>
      <WordProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="words" element={<WordsPage />} />
              <Route path="unknown" element={<UnknownWordsPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WordProvider>
    </ThemeProvider>
  );
}

export default App;
