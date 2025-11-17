// src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  createUser,
  verifyPassword
} = require('../models/userModel');
const { blacklistToken } = require('../config/cache');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '1h';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).toLowerCase().trim();

    if (!trimmedName || !trimmedEmail) {
      return res
        .status(400)
        .json({ error: 'Nome e e-mail não podem ser vazios.' });
    }

    const existing = await findUserByEmail(trimmedEmail);
    if (existing) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    // cria o usuario no banco

    const user = await createUser(trimmedName, trimmedEmail, password);
    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Novo usuário registrado: ${user.email}`);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro em POST /api/auth/register:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const trimmedEmail = String(email).toLowerCase().trim();

    const user = await findUserByEmail(trimmedEmail);
    if (!user) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Tentativa de login falhou - usuário não existe: ${trimmedEmail}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const ok = verifyPassword(password, user);
    if (!ok) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Tentativa de login falhou - senha incorreta: ${trimmedEmail}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`[${timestamp}] Login OK: ${trimmedEmail} (IP: ${ip})`);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro em POST /api/auth/login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res
        .status(400)
        .json({ error: 'Token não informado no header Authorization.' });
    }

    const decoded = jwt.decode(token);
    let ttlSeconds = 3600;

    if (decoded && decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      ttlSeconds = decoded.exp - now;
      if (ttlSeconds <= 0) ttlSeconds = 1;
    }

    await blacklistToken(token, ttlSeconds);

    const timestamp = new Date().toISOString();
    const email = decoded && decoded.email ? decoded.email : 'desconhecido';
    console.log(`[${timestamp}] Logout - Token invalidado: ${email}`);

    return res.json({ message: 'Logout realizado. Token invalidado.' });
  } catch (err) {
    console.error('Erro em POST /api/auth/logout:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

module.exports = router;
