require('dotenv').config();
const mongoose = require('mongoose');


const USER = process.env.USER_DB;
const PASSWORD = process.env.PASSWORD_DB;
const DATABASE = process.env.NAME_DATABASE;
const authSource = 'admin';
const uri = `mongodb+srv://${USER}:${PASSWORD}@${DATABASE}/${authSource}?retryWrites=true&w=majority`;



mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

module.exports = mongoose;