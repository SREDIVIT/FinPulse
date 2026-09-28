import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMongoUri, maskUri } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

async function testConnection() {
  console.log('\n=============================================');
  console.log('   FinTrack MongoDB Connection Diagnostic');
  console.log('=============================================');

  const rawUri = getMongoUri();
  const safeUri = maskUri(rawUri);

  // Check which env variable was detected
  const varSource = process.env.MONGO_URI
    ? 'MONGO_URI'
    : process.env.MONGODB_URI
    ? 'MONGODB_URI'
    : process.env.DATABASE_URL
    ? 'DATABASE_URL'
    : process.env.MONGO_URL
    ? 'MONGO_URL'
    : 'DEFAULT (Fallback)';

  console.log(`[Config] Variable detected: ${varSource}`);
  console.log(`[Config] Target URI:         ${safeUri}`);
  console.log('[Status] Attempting connection (5s timeout)...');

  const startTime = Date.now();

  try {
    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000
    });

    const elapsedMs = Date.now() - startTime;
    const admin = conn.connection.db.admin();
    await admin.ping();

    const collections = await conn.connection.db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log('\n---------------------------------------------');
    console.log(' SUCCESS: Connected to MongoDB!');
    console.log('---------------------------------------------');
    console.log(` Host:         ${conn.connection.host}`);
    console.log(` Port:         ${conn.connection.port || 'Default / Atlas'}`);
    console.log(` Database:     ${conn.connection.name}`);
    console.log(` Latency:      ${elapsedMs} ms`);
    console.log(` Collections:  ${collectionNames.length > 0 ? collectionNames.join(', ') : '(empty database)'}`);
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('\n---------------------------------------------');
    console.error(' FAILED: Could not connect to MongoDB');
    console.log('---------------------------------------------');
    console.error(` Error: ${error.message}\n`);

    console.log(' Troubleshooting Steps:');
    if (rawUri.includes('mongodb+srv://')) {
      console.log(' 1. [Atlas IP Whitelist]: In MongoDB Atlas -> Network Access, ensure your current IP is allowed (or allow 0.0.0.0/0 for testing).');
      console.log(' 2. [Credentials]: Check your username and password in the connection string.');
      console.log(' 3. [Special Characters]: If your password has special symbols (like @, #, $, %), they must be URL-encoded (e.g. @ becomes %40).');
      console.log(' 4. [Database Name]: Make sure a database name is specified after the slash (e.g. /fintrack?retryWrites=true).');
    } else {
      console.log(' 1. [Local Service]: Make sure the local MongoDB service or mongod is running.');
      console.log('    You can run: start-mongo.bat from the project folder.');
      console.log(' 2. [Port]: Ensure MongoDB is listening on port 27017.');
      console.log(' 3. [Atlas Alternative]: Alternatively, get a free MongoDB Atlas cloud URI and put it in .env');
    }
    console.log('=============================================\n');

    process.exit(1);
  }
}

testConnection();
