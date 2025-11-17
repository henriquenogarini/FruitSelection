import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function RegisterForm({ onRegistered }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirm: '' 
  });

  const validateName = (value) => {
    if (!value || !value.trim()) {
      return 'Nome é obrigatório';
    }
    if (value.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }
    return '';
  };

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

  const validateConfirm = (value, passwordValue) => {
    if (!value) {
      return 'Confirmação de senha é obrigatória';
    }
    if (value !== passwordValue) {
      return 'As senhas não coincidem';
    }
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setErrors(prev => ({ ...prev, name: '' }));
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
    if (confirm) {
      setErrors(prev => ({ ...prev, confirm: '' }));
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirm(value);
    setErrors(prev => ({ ...prev, confirm: '' }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirm(confirm, password);

    if (nameError || emailError || passwordError || confirmError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirm: confirmError
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      console.log('Usuário cadastrado com sucesso');

      onRegistered && onRegistered();
    } catch (err) {
      console.error('Erro de rede no registro:', err);
      setServerError('Erro ao se conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Seu nome"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>

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
          placeholder="Crie uma senha (mínimo 6 caracteres)"
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </label>

      <label>
        Confirmar senha
        <input
          type="password"
          value={confirm}
          onChange={handleConfirmChange}
          placeholder="Repita a senha"
          className={errors.confirm ? 'input-error' : ''}
        />
        {errors.confirm && <span className="field-error">{errors.confirm}</span>}
      </label>

      {serverError && <p className="field-error" style={{ marginTop: '10px' }}>{serverError}</p>}
      {successMessage && <p className="auth-success">{successMessage}</p>}

      <div className="auth-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}
