// controllers/table.controller.js

const Table = require('../models/table.model');

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { number, capacity, location } = req.body;

    if (!number || !capacity) {
      return res.status(400).json({ message: 'Table number and capacity are required' });
    }

    // Check if table number is unique
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    const table = new Table({
      number,
      capacity,
      location,
    });

    await table.save();

    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();

    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update table details
exports.updateTable = async (req, res) => {
  try {
    const { number, capacity, location, status } = req.body;

    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Update fields
    if (number !== undefined) table.number = number;
    if (capacity !== undefined) table.capacity = capacity;
    if (location !== undefined) table.location = location;
    if (status !== undefined) table.status = status;

    await table.save();

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
