const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { connectToDatabase } = require('./config/db');
const { connectCache } = require('./config/cache');

const authRoutes = require('./routes/authRoutes');
const fruitRoutes = require('./routes/fruitRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde'
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login, aguarde 15 minutos'
});
app.use('/api/auth/login', authLimiter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/fruits', fruitRoutes);

async function start() {
  try {
    await connectToDatabase();
    await connectCache();

    app.listen(PORT, () => {
      console.log(`Back-end rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
}

start();
