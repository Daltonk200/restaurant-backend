// routes/order.routes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

// Create a new order (customer)
router.post('/', authMiddleware, authorizeRoles('customer'), orderController.createOrder);

// Get all orders (staff and owner)
router.get('/', authMiddleware, authorizeRoles('staff', 'owner'), orderController.getAllOrders);

// Get orders of the logged-in user (customer)
router.get('/my-orders', authMiddleware, authorizeRoles('customer'), orderController.getMyOrders);

// Get an order by ID
router.get('/:id', authMiddleware, orderController.getOrderById);

// Update order status (staff and owner)
router.put('/:id/status', authMiddleware, authorizeRoles('staff', 'owner'), orderController.updateOrderStatus);

// Delete an order
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;
// Compare this snippet from restaurant-backend/controllers/order.controller.js:
