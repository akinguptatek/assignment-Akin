const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cubeSchema = new Schema({
  text: String
});

const CubeModel = mongoose.model('Cube', cubeSchema);

module.exports = CubeModel;

