import { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import SearchBar from './components/SearchBar';
import FruitGrid from './components/FruitGrid';
import DetailModal from './components/DetailModal';
import AddFruitModal from './components/AddFruitModal';
import EditFruitModal from './components/EditFruitModal';
import './App.css';

const API_BASE = 'http://localhost:4000/api';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [addFruitModalOpen, setAddFruitModalOpen] = useState(false);
  const [editFruitModalOpen, setEditFruitModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState(null);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('fs_user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('fs_user');
      localStorage.removeItem('fs_token');
      return null;
    }
  });

  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchSummary, setSearchSummary] = useState('');

  useEffect(() => {
    if (user) {
      loadAllFruits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('fs_token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    };
  };

  const loadAllFruits = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE}/fruits`, {
        headers: getAuthHeaders()
      });

      setFruits(response.data);
      setSearchSummary(`Mostrando todas as frutas (${response.data.length})`);
    } catch (err) {
      setError(err.message || 'Erro ao carregar frutas');
      setFruits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({ mode, query }) => {
    try {
      setLoading(true);
      setError('');

      let url = `${API_BASE}/fruits`;
      
      if (mode !== 'all') {
        const paramName = mode === 'name' ? 'search' : mode;
        url += `?${paramName}=${encodeURIComponent(query)}`;
      }

      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });

      setFruits(response.data);
      
      if (mode === 'all') {
        setSearchSummary(`Mostrando todas as frutas (${response.data.length})`);
      } else {
        setSearchSummary(`Encontrado ${response.data.length} resultados para "${query}" em ${mode}`);
      }
    } catch (err) {
      setError(err.message || 'Falha na busca');
      setFruits([]);
      setSearchSummary('');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFruit = async (fruitData) => {
    const response = await axios.post(`${API_BASE}/fruits`, fruitData, {
      headers: getAuthHeaders()
    });

    const newFruit = response.data;
    setFruits((prev) => [newFruit, ...prev]);
    return newFruit;
  };

  const handleUpdateFruit = async (fruitId, fruitData) => {
    const response = await axios.put(`${API_BASE}/fruits/${fruitId}`, fruitData, {
      headers: getAuthHeaders()
    });

    const updatedFruit = response.data;
    setFruits((prev) => prev.map(f => f._id === fruitId ? updatedFruit : f));
    return updatedFruit;
  };

  const handleDeleteFruit = async (fruitId) => {
    await axios.delete(`${API_BASE}/fruits/${fruitId}`, {
      headers: getAuthHeaders()
    });

    setFruits((prev) => prev.filter(f => f._id !== fruitId));
  };

  const handleOpenEdit = (fruit) => {
    setSelectedFruit(fruit);
    setEditFruitModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (loggedUser, jwtToken) => {
    setUser(loggedUser);
    localStorage.setItem('fs_token', jwtToken);
    localStorage.setItem('fs_user', JSON.stringify(loggedUser));
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('fs_token');
      if (token) {
        await axios.post(`${API_BASE}/auth/logout`, {}, {
          headers: getAuthHeaders()
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setFruits([]);
      localStorage.removeItem('fs_token');
      localStorage.removeItem('fs_user');
    }
  };

  const handleOpenDetail = (fruit) => {
    setSelectedFruit(fruit);
    setDetailModalOpen(true);
  };

  return (
    <div className="app-box">
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onLogoutClick={handleLogout}
        onAddFruit={() => setAddFruitModalOpen(true)}
      />

      <main className="app-main">
        {!user && (
          <section className="welcome-section">
            <div className="welcome-content">
              <div className="welcome-icon">🍎🍌🍓🍊</div>
              <h2>Bem-vindo ao FruitSelection</h2>
              <p>
                Descubra, pesquise e gerencie seu banco de dados de frutas com uma interface bonita.
                Faça login ou crie uma conta para começar!
              </p>
              <button
                className="btn btn-primary btn-large"
                type="button"
                onClick={handleOpenLogin}
              >
                Começar
              </button>
            </div>
          </section>
        )}

        {user && (
          <>
            <SearchBar onSearch={handleSearch} loading={loading} />
            
            {searchSummary && !loading && (
              <div className="search-summary">{searchSummary}</div>
            )}

            {loading && (
              <div className="loading-state">
                <span className="spinner large"></span>
                <p>Carregando frutas...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>❌ {error}</p>
                <button className="btn btn-secondary" onClick={loadAllFruits}>
                  Tentar Novamente
                </button>
              </div>
            )}

            {!loading && !error && (
              <FruitGrid fruits={fruits} onOpenDetail={handleOpenDetail} />
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        switchToLogin={() => setAuthMode('login')}
        switchToRegister={() => setAuthMode('register')}
      />

      <AddFruitModal
        isOpen={addFruitModalOpen}
        onClose={() => setAddFruitModalOpen(false)}
        onAdd={handleAddFruit}
      />

      <DetailModal
        isOpen={detailModalOpen}
        fruit={selectedFruit}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedFruit(null);
        }}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteFruit}
      />

      <EditFruitModal
        isOpen={editFruitModalOpen}
        fruit={selectedFruit}
        onClose={() => {
          setEditFruitModalOpen(false);
          setSelectedFruit(null);
        }}
        onUpdate={handleUpdateFruit}
      />
    </div>
  );
}
