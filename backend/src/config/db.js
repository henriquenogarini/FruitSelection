const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/FruitSelection';

let client;
let db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  client = new MongoClient(MONGO_URI, {
    maxPoolSize: 10
  });

  await client.connect();
  db = client.db('FruitSelection');

  console.log('Conectado ao MongoDB - Database: FruitSelection');
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Banco não inicializado. Chame connectToDatabase() antes.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb
};
