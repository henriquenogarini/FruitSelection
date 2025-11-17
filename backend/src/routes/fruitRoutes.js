// src/routes/fruitRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { insertFruit, searchFruits, findFruitById, updateFruit, deleteFruit } = require('../models/fruitModel');
const { getCache, setCache, isTokenBlacklisted } = require('../config/cache');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token não informado.' });
  }

  try {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Acesso negado - token na blacklist`);
      return res.status(401).json({ error: 'Token inválido (logout realizado).' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Token inválido ou expirado`);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function sanitizeText(value) {
  if (!value || typeof value !== 'string') return value;
  return value.replace(/[<>$]/g, '').trim();
}

router.use(authRequired);

router.get('/', async (req, res) => {
  try {
    const params = {
      search: sanitizeText(req.query.search),
      family: sanitizeText(req.query.family),
      genus: sanitizeText(req.query.genus),
      order: sanitizeText(req.query.order)
    };

    const cacheKey = `fruits:list:${JSON.stringify(params)}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        console.log('Cache HIT:', cacheKey);
        return res.json(cached);
      }
    } catch (err) {
      console.error('Erro ao ler cache (lista):', err);
    }

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Busca: ${req.user.email} - params:`, params);

    const fruits = await searchFruits(params);

    try {
      await setCache(cacheKey, fruits, 60);
      console.log('Cache SET:', cacheKey);
    } catch (err) {
      console.error('Erro ao salvar cache (lista):', err);
    }

    return res.json(fruits);
  } catch (err) {
    console.error('Erro em GET /api/fruits:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.name) {
      return res.status(400).json({ error: 'Nome da fruta é obrigatório.' });
    }

    body.name = sanitizeText(body.name);
    if (body.family) body.family = sanitizeText(body.family);
    if (body.genus) body.genus = sanitizeText(body.genus);
    if (body.order) body.order = sanitizeText(body.order);

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Nova fruta adicionada por ${req.user.email}: ${body.name}`);

    const fruit = await insertFruit(body);

    // Nota: os caches de lista podem ficar "desatualizados" até expirar o TTL (60s).
    // Para o projeto, isso é aceitável e ainda demonstra o uso de cache.

    return res.status(201).json(fruit);
  } catch (err) {
    console.error('Erro em POST /api/fruits:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = sanitizeText(req.params.id);
    const cacheKey = `fruits:id:${id}`;

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        console.log('Cache HIT em fruta por ID:', cacheKey);
        return res.json(cached);
      }
    } catch (err) {
      console.error('Erro ao ler cache (id):', err);
    }

    const fruit = await findFruitById(id);
    if (!fruit) {
      return res.status(404).json({ error: 'Fruta não encontrada.' });
    }

    try {
      await setCache(cacheKey, fruit, 300);
      console.log('Cache SET em fruta por ID:', cacheKey);
    } catch (err) {
      console.error('Erro ao salvar cache (id):', err);
    }

    return res.json(fruit);
  } catch (err) {
    console.error('Erro em GET /api/fruits/:id:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = sanitizeText(req.params.id);
    const body = req.body || {};

    if (!body.name) {
      return res.status(400).json({ error: 'Nome da fruta é obrigatório.' });
    }

    body.name = sanitizeText(body.name);
    if (body.family) body.family = sanitizeText(body.family);
    if (body.genus) body.genus = sanitizeText(body.genus);
    if (body.order) body.order = sanitizeText(body.order);

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Atualização: ${req.user.email} editou fruta ID ${id}`);

    const updatedFruit = await updateFruit(id, body);
    
    if (!updatedFruit) {
      return res.status(404).json({ error: 'Fruta não encontrada.' });
    }

    return res.json(updatedFruit);
  } catch (err) {
    console.error('Erro em PUT /api/fruits/:id:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = sanitizeText(req.params.id);

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Deleção: ${req.user.email} removeu fruta ID ${id}`);

    const deleted = await deleteFruit(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Fruta não encontrada.' });
    }

    return res.json({ message: 'Fruta deletada com sucesso.', id });
  } catch (err) {
    console.error('Erro em DELETE /api/fruits/:id:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

module.exports = router;
