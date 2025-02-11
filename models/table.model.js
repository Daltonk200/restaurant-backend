// models/table.model.js

const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String, // e.g., 'indoors', 'outdoors', 'window', etc.
    },
    status: {
      type: String,
      enum: ['available', 'reserved'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Table', tableSchema);
