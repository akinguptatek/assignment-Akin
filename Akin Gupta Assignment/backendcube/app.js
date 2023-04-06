const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Cube = require('./models/cube');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/cube', async (req, res) => {
  console.log('Calculate cuberoot & Store execution Time');
  const inputvalue = req.body.text;
  const startnow = new Date();
  const start_time = startnow.toLocaleString();
  console.log("Start Time =", start_time);
  console.log(inputvalue);
  const result = Math.cbrt(inputvalue);
  console.log (result);
  const endnow = new Date();
  const end_time = endnow.toLocaleString();
  console.log("End Time =", end_time);
  const cubetime = endnow-startnow;
  console.log("time Taken = ",cubetime);

  if (!cubetime === 0) {
    console.log('INVALID Value');
    return res.status(422).json({ message: 'Invalid Value.' });
  }

  const cube = new Cube({
    text: cubetime,
  });

  try {
    await cube.save();
    res
      .status(201)
      .json({ result: result, cube: { id: cube.id, text: cubetime } });
    console.log('STORED CUBE ROOT EXECUTION TIME');
  } catch (err) {
    console.error('ERROR SAVING CUBE ROOT EXECUTION TIME');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save cube root execution time.' });
  }
});

mongoose.connect(
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/course-goals?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB!!');
      app.listen(8082);
    }
  }
);
