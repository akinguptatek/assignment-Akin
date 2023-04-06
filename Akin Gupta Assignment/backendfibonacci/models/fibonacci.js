const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fibonacciSchema = new Schema({
  text: String
});

const FibonacciModel = mongoose.model('Fibonacci', fibonacciSchema);

module.exports = FibonacciModel;