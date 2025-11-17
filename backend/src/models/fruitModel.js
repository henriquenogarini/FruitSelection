const { getDb } = require('../config/db');

const FRUITS_COLLECTION = 'fruits';

async function insertFruit(fruitData) {
  const db = getDb();
  const fruits = db.collection(FRUITS_COLLECTION);

  const doc = {
    name: String(fruitData.name).trim(),
    family: fruitData.family ? String(fruitData.family).trim() : null,
    genus: fruitData.genus ? String(fruitData.genus).trim() : null,
    order: fruitData.order ? String(fruitData.order).trim() : null,
    image: fruitData.image ? String(fruitData.image).trim() : null,
    nutritions: fruitData.nutritions || null,
    createdAt: new Date()
  };

  const result = await fruits.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function searchFruits({ search, family, genus, order }) {
  const db = getDb();
  const fruits = db.collection(FRUITS_COLLECTION);

  const filter = {};

  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: 'i' };
  }
  if (family) {
    filter.family = { $regex: escapeRegex(family), $options: 'i' };
  }
  if (genus) {
    filter.genus = { $regex: escapeRegex(genus), $options: 'i' };
  }
  if (order) {
    filter.order = { $regex: escapeRegex(order), $options: 'i' };
  }

  const cursor = fruits.find(filter).sort({ name: 1 }).limit(100);
  return cursor.toArray();
}

async function findFruitById(id) {
  const db = getDb();
  const fruits = db.collection(FRUITS_COLLECTION);
  const { ObjectId } = require('mongodb');

  return fruits.findOne({ _id: new ObjectId(id) });
}

async function updateFruit(id, fruitData) {
  const db = getDb();
  const fruits = db.collection(FRUITS_COLLECTION);
  const { ObjectId } = require('mongodb');

  const updateDoc = {
    name: String(fruitData.name).trim(),
    family: fruitData.family ? String(fruitData.family).trim() : null,
    genus: fruitData.genus ? String(fruitData.genus).trim() : null,
    order: fruitData.order ? String(fruitData.order).trim() : null,
    image: fruitData.image ? String(fruitData.image).trim() : null,
    nutritions: fruitData.nutritions || null,
    updatedAt: new Date()
  };

  const result = await fruits.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateDoc },
    { returnDocument: 'after' }
  );

  return result;
}

async function deleteFruit(id) {
  const db = getDb();
  const fruits = db.collection(FRUITS_COLLECTION);
  const { ObjectId } = require('mongodb');

  const result = await fruits.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  insertFruit,
  searchFruits,
  findFruitById,
  updateFruit,
  deleteFruit
};
