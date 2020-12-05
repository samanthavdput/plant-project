const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const plantSchema = new Schema(
  {
    commonName: String,
    plantCare: String,
    placement: String,
    observations: String,
    imageUrl: String
  },

  {
    timestamps: true
  }
);

module.exports = model('Model', plantSchema);