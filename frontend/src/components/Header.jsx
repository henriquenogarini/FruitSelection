export function Header({ user, onLoginClick, onLogoutClick, onAddFruit }) {
  return (
    <header className="header">
      <div className="logo" title="FruitSelection">
        <span className="logo-fruit left">🍎</span>
        <h1 className="logo-text">FruitSelection</h1>
        <span className="logo-fruit right">🍌</span>
      </div>

      <div className="header-actions">
        {user ? (
          <>
            <button className="btn btn-add" onClick={onAddFruit} title="Adicionar nova fruta">
              Adicionar Fruta
            </button>
            <span className="user-name">Olá {user.name}</span>
            <button className="btn btn-secondary" onClick={onLogoutClick}>
              Sair
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}
