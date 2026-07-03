const { MongoClient } = require('mongodb');
require('dotenv').config();

// Support for local MongoDB
let uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
if (uri === 'local') {
  uri = 'mongodb://localhost:27017';
  console.log('📍 Using local MongoDB (set MONGO_URI="local" in .env)');
}

const dbName = 'shopmate';

let db;
let client;

const connectDB = async (retries = 5, delay = 2000) => {
  if (db) return db;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n[Attempt ${attempt}/${retries}] Connecting to MongoDB...`);
      const displayUri = uri === 'mongodb://localhost:27017' ? 'mongodb://localhost:27017' : uri.replace(/:[^@]*@/, ':****@');
      console.log(`   Connecting to: ${displayUri}`);
      
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      await client.connect();
      console.log('✅ MongoDB Connected Successfully!');
      db = client.db(dbName);
      return db;
    } catch (error) {
      console.error(`❌ Connection attempt ${attempt} failed:`);
      console.error("Error name:", error.name);
      console.error("Error code:", error.code);
      console.error("Error cause:", error.cause);
      console.error(error);      
      if (attempt === retries) {
        console.error('\n⚠️  Could not connect to MongoDB');
        console.error('\n💡 QUICK FIX - Start MongoDB with Docker:');
        console.error('   $ docker run -d -p 27017:27017 --name shopmate-mongo mongo:latest');
        console.error('\n   Then restart the server with: npm run dev');
        process.exit(1);
      }
      
      console.log(`   Retrying in ${delay / 1000} seconds...\n`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = { connectDB, getDB };
