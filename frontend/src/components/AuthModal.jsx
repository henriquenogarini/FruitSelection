import { useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthModal({
  isOpen,
  mode,
  onClose,
  onLoginSuccess,
  switchToLogin,
  switchToRegister
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = mode === 'login' ? 'Entrar' : 'Criar conta';

  return (
    <div className="modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button
            className="modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        <div className="modal-content">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={onLoginSuccess}
              onSwitchToRegister={switchToRegister}
            />
          ) : (
            <RegisterForm onRegistered={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
}
