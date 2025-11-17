import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (value) => {
    if (!value) {
      return 'E-mail é obrigatório';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'E-mail inválido. Use o formato: exemplo@email.com';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Senha é obrigatória';
    }
    if (value.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: '' }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      console.log('Login realizado');

      onSuccess(response.data.user, response.data.token);
    } catch (err) {
      console.error('Erro de rede no login:', err);
      setServerError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        E-mail
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          placeholder="seuemail@exemplo.com"
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>

      <label>
        Senha
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Sua senha"
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </label>

      {serverError && <p className="field-error" style={{ marginTop: '10px' }}>{serverError}</p>}

      <div className="auth-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="auth-switch-text">
          Ainda não tem conta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToRegister}
          >
            Registrar-se
          </button>
        </p>
      </div>
    </form>
  );
}
