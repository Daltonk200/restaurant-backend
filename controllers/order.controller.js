// controllers/order.controller.js

const Order = require('../models/order.model');
const MenuItem = require('../models/menuItem.model');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Expects items to be an array of { _id, quantity }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      // Make sure we have an _id
      if (!item._id) {
        return res.status(400).json({ message: 'Each item must have an _id' });
      }

      const menuItem = await MenuItem.findById(item._id);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item._id}` });
      }

      // Check if item is available
      if (!menuItem.available) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      const quantity = item.quantity || 1;
      const itemTotal = menuItem.price * quantity;
      totalPrice += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity,
      });
    }

    // Create new order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      status: 'pending',
    });

    await order.save();

    // Populate the response for better details
    const populatedOrder = await Order.findById(order._id)
      .populate('items.menuItem')
      .populate('user', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders (for staff and owner)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.menuItem');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders specific to the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId }).populate('items.menuItem');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization check
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status (staff and owner)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expects 'status' in the body

    if (!status || !['pending', 'confirmed', 'preparing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization check
    const isOwnerOrStaff = req.user.role === 'owner' || req.user.role === 'staff';
    const isOrderOwner = order.user.toString() === req.user.id;

    if (!isOwnerOrStaff && !(isOrderOwner && order.status === 'pending')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await order.remove();

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
