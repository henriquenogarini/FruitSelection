// src/components/SearchBar.jsx
import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [searchMode, setSearchMode] = useState('name');
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ mode: searchMode, query: query.trim() });
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch({ mode: 'all', query: '' });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar-controls">
        <label htmlFor="search-mode" className="sr-only">
          Search by
        </label>
        <select
          id="search-mode"
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}
          className="search-mode-select"
        >
          <option value="name">Nome</option>
          <option value="family">Família</option>
          <option value="genus">Gênero</option>
          <option value="order">Ordem</option>
        </select>

        <label htmlFor="search-input" className="sr-only">
          Buscar
        </label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar frutas... (ex: Maçã, Banana)"
          className="search-input"
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <span className="spinner" aria-label="Carregando"></span>
          ) : (
            '🔍 Buscar'
          )}
        </button>

        {query && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
          >
            Limpar
          </button>
        )}
      </div>
    </form>
  );
}
