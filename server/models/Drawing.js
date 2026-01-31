const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  logic: {
    type: Array, // Array of step objects e.g., { action: 'move', value: 100 }
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Drawing', drawingSchema);
