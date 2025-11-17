// Cache em memória
const memoryCache = new Map();
const blacklistStore = new Map();

function now() {
  return Date.now();
}

async function connectCache() {
  console.log('Cache em memória inicializado');
}

async function getCache(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  // checa se expirou
  if (entry.expiresAt && entry.expiresAt < now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

async function setCache(key, value, ttlSeconds) {
  let expiresAt = null;

  if (ttlSeconds && ttlSeconds > 0) {
    expiresAt = now() + ttlSeconds * 1000;
  }

  memoryCache.set(key, { value, expiresAt });
}

async function blacklistToken(token, ttlSeconds) {
  const ttl = ttlSeconds && ttlSeconds > 0 ? ttlSeconds : 3600;
  const expiresAt = now() + ttl * 1000;

  blacklistStore.set(token, expiresAt);
}

async function isTokenBlacklisted(token) {
  const expiresAt = blacklistStore.get(token);
  if (!expiresAt) return false;

  if (expiresAt < now()) {
    blacklistStore.delete(token);
    return false;
  }

  return true;
}

module.exports = {
  connectCache,
  getCache,
  setCache,
  blacklistToken,
  isTokenBlacklisted
};
