const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const squareSchema = new Schema({
  text: String
});

const SquareModel = mongoose.model('Square', squareSchema);

module.exports = SquareModel;