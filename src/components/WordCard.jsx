import { useState } from 'react';
import { useWords } from '../context/WordContext';

const WordCard = ({ word }) => {
  const { markAsUnknown, deleteWord, updateWord } = useWords();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWord, setEditedWord] = useState(word);

  const categoryIcons = {
    greeting: '👋',
    verb: '🏃',
    noun: '🏠',
    adjective: '🎨',
    number: '🔢',
    phrase: '💬'
  };

  const handleSave = () => {
    updateWord(word.id, editedWord);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedWord(word);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-indigo-500">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rus tilida
            </label>
            <input
              type="text"
              value={editedWord.russian}
              onChange={(e) => setEditedWord({ ...editedWord, russian: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O'zbek tilida
            </label>
            <input
              type="text"
              value={editedWord.uzbek}
              onChange={(e) => setEditedWord({ ...editedWord, uzbek: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategoriya
            </label>
            <select
              value={editedWord.category}
              onChange={(e) => setEditedWord({ ...editedWord, category: e.target.value })}
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

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Saqlash
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow ${word.isUnknown ? 'border-2 border-red-300' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[word.category] || '📝'}</span>
          <span className="text-xs font-medium text-gray-500 capitalize">
            {word.category}
          </span>
        </div>
        {word.isUnknown && (
          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
            Bilmadim
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          {word.russian}
        </div>
        <div className="text-lg text-indigo-600">
          {word.uzbek}
        </div>
      </div>

      {word.example && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
          <div className="text-gray-700 mb-1 italic">
            "{word.example}"
          </div>
          <div className="text-gray-600">
            "{word.exampleTranslation}"
          </div>
        </div>
      )}

      <div className="flex gap-2 text-sm">
        <button
          onClick={() => markAsUnknown(word.id, !word.isUnknown)}
          className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
            word.isUnknown
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {word.isUnknown ? '✓ Bildim' : '✗ Bilmadim'}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          ✏️ Tahrirlash
        </button>
        <button
          onClick={() => {
            if (confirm('Rostdan ham o\'chirmoqchimisiz?')) {
              deleteWord(word.id);
            }
          }}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🗑️
        </button>
      </div>

      {word.timesReviewed > 0 && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          {word.timesReviewed} marta ko'rib chiqilgan
        </div>
      )}
    </div>
  );
};

export default WordCard;
