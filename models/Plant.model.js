const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const plantSchema = new Schema(
  {
    name: String,
    plantCare: String,
    placement: String,
    observations: String,
    imageUrl: String
  },

  {
    timestamps: true
  }
);

module.exports = model('Plant', plantSchema);