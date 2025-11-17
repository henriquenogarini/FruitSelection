import { useEffect } from 'react';

export default function DetailModal({ isOpen, fruit, onClose, onEdit, onDelete }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fruit) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{fruit.name}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-layout">
            <div className="detail-image">
              {fruit.image ? (
                <img src={fruit.image} alt={fruit.name} />
              ) : (
                <div className="detail-emoji">🍎</div>
              )}
            </div>

            <div className="detail-info">
              <div className="detail-tags">
                {fruit.family && (
                  <span className="tag">
                    <strong>Família:</strong> {fruit.family}
                  </span>
                )}
                {fruit.genus && (
                  <span className="tag">
                    <strong>Gênero:</strong> {fruit.genus}
                  </span>
                )}
                {fruit.order && (
                  <span className="tag">
                    <strong>Ordem:</strong> {fruit.order}
                  </span>
                )}
              </div>

              {fruit.nutritions && (
                <>
                  <h4>Informações Nutricionais (por 100g)</h4>
                  <table className="nutrition-table">
                    <tbody>
                      <tr>
                        <td>Calorias</td>
                        <td>{fruit.nutritions.calories || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td>Carboidratos</td>
                        <td>{fruit.nutritions.carbohydrates || 'N/A'} g</td>
                      </tr>
                      <tr>
                        <td>Proteína</td>
                        <td>{fruit.nutritions.protein || 'N/A'} g</td>
                      </tr>
                      <tr>
                        <td>Gordura</td>
                        <td>{fruit.nutritions.fat || 'N/A'} g</td>
                      </tr>
                      <tr>
                        <td>Açúcar</td>
                        <td>{fruit.nutritions.sugar || 'N/A'} g</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onEdit && onEdit(fruit);
              }}
            >
            Editar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja deletar "${fruit.name}"?`)) {
                  onDelete && onDelete(fruit._id);
                  onClose();
                }
              }}
            >
            Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
