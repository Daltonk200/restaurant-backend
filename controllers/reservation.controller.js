// controllers/reservation.controller.js

const Reservation = require('../models/reservation.model');
const Table = require('../models/table.model');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes auth middleware sets req.user
    console.log("user:",userId);
    const { tableId, date, timeSlot, numberOfPeople, specialRequests } = req.body;

    // Validation
    if (!tableId || !date || !timeSlot || !numberOfPeople) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check table capacity
    if (numberOfPeople > table.capacity) {
      return res.status(400).json({ message: 'Table cannot accommodate the number of people' });
    }

    // Check availability
    const existingReservation = await Reservation.findOne({
      table: tableId,
      date: date,
      timeSlot: timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Table is already reserved at the requested time' });
    }

    // Create reservation
    const reservation = new Reservation({
      user: userId,
      table: tableId,
      date,
      timeSlot,
      numberOfPeople,
      specialRequests,
      status: 'pending',
    });

    await reservation.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reservations (staff and owner)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('table');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reservations of the logged-in user
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await Reservation.find({ user: userId }).populate('table');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('table');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Authorization check
    if (req.user.role === 'customer' && reservation.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update reservation status (staff and owner)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Authorization check
    const isOwnerOrStaff = req.user.role === 'owner' || req.user.role === 'staff';
    const isReservationOwner = reservation.user.toString() === req.user.id;

    if (!isOwnerOrStaff && !isReservationOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await reservation.remove();

    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
