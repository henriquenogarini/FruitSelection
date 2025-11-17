import { useState, useEffect } from 'react';

export default function EditFruitModal({ isOpen, onClose, onUpdate, fruit }) {
  const [formData, setFormData] = useState({
    name: '',
    family: '',
    genus: '',
    order: '',
    image: '',
    nutritions: {
      calories: '',
      carbohydrates: '',
      protein: '',
      fat: '',
      sugar: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fruit) {
      setFormData({
        name: fruit.name || '',
        family: fruit.family || '',
        genus: fruit.genus || '',
        order: fruit.order || '',
        image: fruit.image || '',
        nutritions: {
          calories: fruit.nutritions?.calories || '',
          carbohydrates: fruit.nutritions?.carbohydrates || '',
          protein: fruit.nutritions?.protein || '',
          fat: fruit.nutritions?.fat || '',
          sugar: fruit.nutritions?.sugar || ''
        }
      });
    }
  }, [fruit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('nutritions.')) {
      const nutritionKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        nutritions: {
          ...prev.nutritions,
          [nutritionKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Nome da fruta é obrigatório');
      return;
    }

    if (!formData.image.trim()) {
      setError('URL da imagem é obrigatória');
      return;
    }

    if (!formData.nutritions.calories || !formData.nutritions.carbohydrates || 
        !formData.nutritions.protein || !formData.nutritions.fat || !formData.nutritions.sugar) {
      setError('Todas as informações nutricionais são obrigatórias');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(fruit._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Falha ao atualizar fruta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen || !fruit) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Fruta</h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit} className="add-fruit-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="edit-name">
                Nome da Fruta <span className="required">*</span>
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ex: Maçã, Banana"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-image">
                URL da Imagem <span className="required">*</span>
              </label>
              <input
                type="url"
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem-fruta.jpg"
                required
              />
              <small className="form-hint">
                Forneça um link direto para a imagem da fruta
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-family">Família</label>
                <input
                  type="text"
                  id="edit-family"
                  name="family"
                  value={formData.family}
                  onChange={handleChange}
                  placeholder="ex: Rosaceae"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-genus">Gênero</label>
                <input
                  type="text"
                  id="edit-genus"
                  name="genus"
                  value={formData.genus}
                  onChange={handleChange}
                  placeholder="ex: Malus"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-order">Ordem</label>
              <input
                type="text"
                id="edit-order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="ex: Rosales"
              />
            </div>

            <fieldset className="nutrition-fieldset">
              <legend>Informações Nutricionais (por 100g)</legend>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-calories">
                    Calorias <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-calories"
                    name="nutritions.calories"
                    value={formData.nutritions.calories}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-carbohydrates">
                    Carboidratos (g) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-carbohydrates"
                    name="nutritions.carbohydrates"
                    value={formData.nutritions.carbohydrates}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-protein">
                    Proteína (g) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-protein"
                    name="nutritions.protein"
                    value={formData.nutritions.protein}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-fat">
                    Gordura (g) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-fat"
                    name="nutritions.fat"
                    value={formData.nutritions.fat}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-sugar">
                  Açúcar (g) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="edit-sugar"
                  name="nutritions.sugar"
                  value={formData.nutritions.sugar}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </fieldset>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
