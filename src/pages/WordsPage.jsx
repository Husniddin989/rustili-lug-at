import { useState, useMemo } from 'react';
import { useWords } from '../context/WordContext';
import WordCard from '../components/WordCard';

const WordsPage = () => {
  const { words, addWord } = useWords();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    russian: '',
    uzbek: '',
    category: 'noun',
    example: '',
    exampleTranslation: ''
  });

  // Filter and search words
  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const matchesSearch =
        word.russian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.uzbek.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || word.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [words, searchTerm, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(words.map(w => w.category))];
    return cats.sort();
  }, [words]);

  const handleAddWord = (e) => {
    e.preventDefault();
    if (newWord.russian && newWord.uzbek) {
      addWord(newWord);
      setNewWord({
        russian: '',
        uzbek: '',
        category: 'noun',
        example: '',
        exampleTranslation: ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            📚 So'zlar ro'yxati
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showAddForm ? '✗ Yopish' : '+ So\'z qo\'shish'}
          </button>
        </div>

        {/* Add Word Form */}
        {showAddForm && (
          <form onSubmit={handleAddWord} className="bg-indigo-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rus tilida *
                </label>
                <input
                  type="text"
                  required
                  value={newWord.russian}
                  onChange={(e) => setNewWord({ ...newWord, russian: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masalan: здравствуйте"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O'zbek tilida *
                </label>
                <input
                  type="text"
                  required
                  value={newWord.uzbek}
                  onChange={(e) => setNewWord({ ...newWord, uzbek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masalan: salom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoriya
                </label>
                <select
                  value={newWord.category}
                  onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="greeting">Salomlashish</option>
                  <option value="verb">Fe'l</option>
                  <option value="noun">Ot</option>
                  <option value="adjective">Sifat</option>
                  <option value="number">Raqam</option>
                  <option value="phrase">Ibora</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Misol (rus tili)
                </label>
                <input
                  type="text"
                  value={newWord.example}
                  onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Misol jumla"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Misol tarjimasi (o'zbek tili)
                </label>
                <input
                  type="text"
                  value={newWord.exampleTranslation}
                  onChange={(e) => setNewWord({ ...newWord, exampleTranslation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Misol tarjimasi"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              So'z qo'shish
            </button>
          </form>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="So'z qidirish... (rus yoki o'zbek tilida)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hammasi ({words.length})
          </button>
          {categories.map((category) => {
            const count = words.filter(w => w.category === category).length;
            const icons = {
              greeting: '👋',
              verb: '🏃',
              noun: '🏠',
              adjective: '🎨',
              number: '🔢',
              phrase: '💬'
            };

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {icons[category]} {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center text-gray-600">
        {filteredWords.length} ta so'z topildi
      </div>

      {/* Words Grid */}
      {filteredWords.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-gray-600">
            Hech qanday so'z topilmadi
          </p>
        </div>
      )}
    </div>
  );
};

export default WordsPage;
