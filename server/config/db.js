import mongoose from 'mongoose';

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const getDbState = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fintrack';

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
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout for fast detection
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n[MongoDB] Connection Failed: ${error.message}`);
    console.error(`[MongoDB] TIP: Make sure your local MongoDB service is running on port 27017,`);
    console.error(`[MongoDB] or provide a free MongoDB Atlas URI in 'server/.env' as:`);
    console.error(`[MongoDB] MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fintrack\n`);
  }
};

export default connectDB;

