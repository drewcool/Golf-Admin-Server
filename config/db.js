const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/golf-admin';
    console.log('Connecting to database:', dbUrl);
    
    await mongoose.connect(dbUrl);
    console.log('DataBase Connected successfully');
  } catch (error) {
    console.log('Database connection error:', error);
    console.log('Please make sure MongoDB is running on your system');
  }
};

module.exports = { connectDB };