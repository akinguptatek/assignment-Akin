const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Square = require('./models/square');
const Cube = require('./models/cube');
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

app.get('/metric', async (req, res) => {
  console.log('TRYING TO METRIC DETAILS');
  try {
    const square = await Square.find();
    const cube = await Cube.find();
    const fibonacci = await Fibonacci.find();
    console.log(square);
    console.log(cube);
    console.log(fibonacci);
    let sumSquare =0, sumCube=0, sumfibonacci = 0,countSquare=0,countCube=0,countFibonacci=0;
    square.forEach(element => {
      sumSquare = sumSquare + Number(element.text);
      countSquare=countSquare+1;
    });
    cube.forEach(element => {
      sumCube = sumCube + Number(element.text);
      countCube=countCube+1;
    });
    fibonacci.forEach(element => {
      sumfibonacci = sumfibonacci + Number(element.text);
      countFibonacci=countFibonacci+1;
    });
    console.log(sumSquare,countSquare,sumCube,countCube,sumfibonacci,countFibonacci);
    squaretime = sumSquare/countSquare;
    cubetime = sumCube/countCube;
    fibonaccitime = sumfibonacci/countFibonacci;
    res.status(201).json({ squareresult: squaretime.toString(), cuberesult: cubetime.toString(),fibonacciresult: fibonaccitime.toString() });
    console.log('FETCHED METRIC DETAILS');
    
  } catch (err) {
    console.error('ERROR FETCHING METRIC DETAILS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load metric' });
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