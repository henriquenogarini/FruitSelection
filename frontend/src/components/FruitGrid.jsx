import { useState } from 'react';

export default function FruitGrid({ fruits, onOpenDetail }) {
  if (!fruits || fruits.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma fruta encontrada. Tente buscar ou adicione uma nova!</p>
      </div>
    );
  }

  return (
    <div className="fruit-grid">
      {fruits.map((fruit) => (
        <FruitCard
          key={fruit._id || fruit.id}
          fruit={fruit}
          onClick={() => onOpenDetail(fruit)}
        />
      ))}
    </div>
  );
}

function FruitCard({ fruit, onClick }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fruit-card" onClick={onClick} title={`Ver detalhes de ${fruit.name}`}>
      <div className="fruit-card-image">
        {fruit.image && !imageError ? (
          <img
            src={fruit.image}
            alt={fruit.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="fruit-emoji">🍎</div>
        )}
      </div>
      <div className="fruit-card-body">
        <h3 className="fruit-card-title">{fruit.name}</h3>
        <p className="fruit-card-meta">
          {fruit.family || 'Família desconhecida'}
        </p>
        {fruit.genus && (
          <p className="fruit-card-submeta">{fruit.genus}</p>
        )}
      </div>
    </div>
  );
}
