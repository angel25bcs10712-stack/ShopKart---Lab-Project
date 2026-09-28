import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const fetchFakeStoreProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');

  if (!response.ok) {
    throw new Error(`Fake Store API error: ${response.status}`);
  } 

  const products = await response.json();

  return products.map((product) => ({
    name: product.title,
    description: product.description,
    price: Math.round(product.price * 100),
    category: product.category,
    image: product.image,
    stock: Math.max(5, Math.min(50, Math.round(product.price * 5)))
  }));
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await fetchFakeStoreProducts();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Products seeded successfully from Fake Store API (${products.length} products)`);
    process.exit(0);
  } catch (error) {
    console.log('Seed error:', error.message);
    process.exit(1);
  }
};

seedProducts();
