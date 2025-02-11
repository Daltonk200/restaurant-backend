const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({  
    origin: 'http://localhost:3000',  
    credentials: true,  
  }));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const reservationRoutes = require('./routes/reservation.routes');
const orderRoutes = require('./routes/order.routes');
const menuItemRoutes = require('./routes/menuItem.routes');
const tableRoutes = require('./routes/table.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/tables', tableRoutes);

module.exports = app;
