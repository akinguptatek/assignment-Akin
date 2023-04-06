const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Square = require('./models/square');

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

app.post('/square', async (req, res) => {
  console.log('Calculate squareroot & Store execution Time');
  const inputvalue = req.body.text;
  const startnow = new Date();
  const start_time = startnow.toLocaleString();
  console.log("Start Time =", start_time);
  console.log(inputvalue);
  const result = Math.sqrt(inputvalue);
  console.log (result);
  const endnow = new Date();
  const end_time = endnow.toLocaleString();
  console.log("End Time =", end_time);
  const squaretime = endnow-startnow;
  console.log("time Taken = ",squaretime);

  if (!squaretime === 0) {
    console.log('INVALID Value');
    return res.status(422).json({ message: 'Invalid Value.' });
  }

  const square = new Square({
    text: squaretime,
  });

  try {
    await square.save();
    res
      .status(201)
      .json({ result: result, square: { id: square.id, text: squaretime } });
    console.log('STORED SQUARE ROOT EXECUTION TIME');
  } catch (err) {
    console.error('ERROR SAVING SQUARE ROOT EXECUTION TIME');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save square root execution time.' });
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
    }
    app.listen(80);
  }
);
