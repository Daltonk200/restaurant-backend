// routes/table.routes.js

const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

// Create a new table (owner)
router.post('/', authMiddleware, authorizeRoles('owner'), tableController.createTable);

// Get all tables (public)
router.get('/', tableController.getAllTables);

// Get a table by ID (public)
router.get('/:id', tableController.getTableById);

// Update a table (owner)
router.put('/:id', authMiddleware, authorizeRoles('owner'), tableController.updateTable);

// Delete a table (owner)
router.delete('/:id', authMiddleware, authorizeRoles('owner'), tableController.deleteTable);

module.exports = router;
