import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WordProvider } from './context/WordContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import FlashcardsPage from './pages/FlashcardsPage';
import WordsPage from './pages/WordsPage';
import UnknownWordsPage from './pages/UnknownWordsPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <WordProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="words" element={<WordsPage />} />
            <Route path="unknown" element={<UnknownWordsPage />} />
            <Route path="quiz" element={<QuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WordProvider>
  );
}

export default App;
