const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

// Get user profile (logged-in user)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Update user profile (logged-in user)
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Get all users (owner only)
router.get('/', authMiddleware, authorizeRoles('owner'), userController.getAllUsers);

// Get user by ID (owner only)
router.get('/:id', authMiddleware, authorizeRoles('owner'), userController.getUserById);

// Delete user (owner only)
router.delete('/:id', authMiddleware, authorizeRoles('owner'), userController.deleteUser);

module.exports = router; // Ensure this line exports the router
