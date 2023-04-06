const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Fibonacci = require('./models/fibonacci');

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

app.post('/fibonacci', async (req, res) => {
  console.log('Calculate fibonacci & Store execution Time');
  const inputvalue = req.body.text;
  const startnow = new Date();
  const start_time = startnow.toLocaleString();
  console.log("Start Time =", start_time);
  console.log(inputvalue);
  let n1 = 0, n2 = 1, nth;
  let count = 0
  if (inputvalue <= 0)
    console.log("Please enter a positive integer")
  else if (inputvalue == 1){
    console.log("Fibonacci sequence upto",inputvalue,":")
    console.log(n1)
    result=n1
  }
  else{
    console.log("Fibonacci sequence:")
    var result = " "
    while ( count < inputvalue){
      result=result + n1 +" "
      nth = n1 + n2
      n1 = n2
      n2 = nth
      count += 1
    }
  } 
  console.log (result);
  const endnow = new Date();
  const end_time = endnow.toLocaleString();
  console.log("End Time =", end_time);
  const fibonaccitime = endnow-startnow;
  console.log("time Taken = ",fibonaccitime);

  if (!fibonaccitime === 0) {
    console.log('INVALID Value');
    return res.status(422).json({ message: 'Invalid Value.' });
  }

  const fibonacci = new Fibonacci({
    text: fibonaccitime,
  });

  try {
    await fibonacci.save();
    res
      .status(201)
      .json({ result: result, fibonacci: { id: fibonacci.id, text: fibonaccitime } });
    console.log('STORED FIBONACCI EXECUTION TIME');
  } catch (err) {
    console.error('ERROR SAVING FIBONACCI EXECUTION TIME');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save fibonacci execution time.' });
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
      app.listen(8085);
    }
  }
);
