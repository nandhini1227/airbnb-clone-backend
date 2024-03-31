require('dotenv').config({ path: './config.env' }); 

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('./utils/config');

console.log('MONGO_URI:', process.env.MONGO_URI); 

mongoose
  .connect(process.env.MONGO_URI) 
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('Error Connecting to DB:', err));




const port = config.PORT || 3011;

app.get('/', (req, res) => {
  res.send('airbnb-clone server is running');
});

app.listen(port, err => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${port}`);
});
