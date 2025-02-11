// routes/reservation.routes.js

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

// Create a new reservation (customer)
router.post('/', authMiddleware, authorizeRoles('customer'), reservationController.createReservation);

// Get all reservations (staff and owner)
router.get('/', authMiddleware, authorizeRoles('staff', 'owner'), reservationController.getAllReservations);

// Get reservations of the logged-in user (customer)
router.get('/my-reservations', authMiddleware, authorizeRoles('customer'), reservationController.getMyReservations);

// Get a reservation by ID
router.get('/:id', authMiddleware, reservationController.getReservationById);

// Update reservation status (staff and owner)
router.put('/:id/status', authMiddleware, authorizeRoles('staff', 'owner'), reservationController.updateReservationStatus);

// Delete a reservation
router.delete('/:id', authMiddleware, reservationController.deleteReservation);

module.exports = router;
// Compare this snippet from restaurant-backend/models/order.model.js: