const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  console.log('connecting to database...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('connected to database');
}

module.exports = connectDB;
