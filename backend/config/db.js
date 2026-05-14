const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;
    
    // Check if it exists
    if (!mongoURI) {
      console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is not set!');
      console.error('Please add MONGO_URI to your Railway environment variables');
      console.error('Example: mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }
    
    // Make sure we're not using localhost
    if (mongoURI.includes('127.0.0.1') || mongoURI.includes('localhost')) {
      console.error('❌ ERROR: Still using localhost! Please set MONGO_URI to your Atlas connection string');
      process.exit(1);
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('Using connection string starting with:', mongoURI.substring(0, 30) + '...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check if MONGO_URI is set correctly in Railway');
    console.error('   2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0');
    console.error('   3. Check if username/password are correct');
    process.exit(1);
  }
};

module.exports = connectDB;