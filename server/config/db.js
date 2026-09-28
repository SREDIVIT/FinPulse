import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of working directory (server/.env or root .env)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

/**
 * Resolves the MongoDB connection string from environment variables
 * Supports MONGO_URI, MONGODB_URI, DATABASE_URL, and MONGO_URL
 */
export const getMongoUri = () => {
  return (
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/fintrack'
  );
};

/**
 * Mask sensitive credentials in connection string for safe console logging
 */
export const maskUri = (uri) => {
  if (!uri) return 'undefined';
  return uri.replace(/:([^@/]+)@/, ':****@');
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const getDbState = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const connectDB = async () => {
  const uri = getMongoUri();
  const safeUri = maskUri(uri);

  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Active connection established to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection disconnected.');
  });

  try {
    console.log(`[MongoDB] Connecting to database (${safeUri})...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5-second fast failover detection
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n=============================================`);
    console.error(`[MongoDB] Connection Failed!`);
    console.error(`Target URI: ${safeUri}`);
    console.error(`Error: ${error.message}`);
    console.error(`---------------------------------------------`);
    console.error(`HOW TO FIX:`);
    console.error(`1. Check your .env file in 'FinPulse/.env' or 'FinPulse/server/.env'.`);
    console.error(`2. Set MONGO_URI to your connection string:`);
    console.error(`   - Local MongoDB: MONGO_URI=mongodb://127.0.0.1:27017/fintrack`);
    console.error(`   - MongoDB Atlas: MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/fintrack?retryWrites=true&w=majority`);
    console.error(`3. If using Atlas, verify your IP is whitelisted (Network Access in Atlas).`);
    console.error(`=============================================\n`);
  }
};

export default connectDB;
