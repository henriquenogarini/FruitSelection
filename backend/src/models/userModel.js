const { getDb } = require('../config/db');
const crypto = require('crypto');

const USERS_COLLECTION = 'users';

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

function verifyPassword(password, user) {
  const hashCheck = crypto
    .pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512')
    .toString('hex');

  return hashCheck === user.passwordHash;
}

async function findUserByEmail(email) {
  const db = getDb();
  const users = db.collection(USERS_COLLECTION);

  return users.findOne({ email: email.toLowerCase() });
}

async function createUser(name, email, password) {
  const db = getDb();
  const users = db.collection(USERS_COLLECTION);

  const { salt, hash } = createPasswordHash(password);

  const newUser = {
    name,
    email: email.toLowerCase(),
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: new Date()
  };

  await users.insertOne(newUser);
  return newUser;
}

module.exports = {
  findUserByEmail,
  createUser,
  verifyPassword
};
