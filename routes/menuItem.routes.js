const express = require('express');
const router  = express.Router();
const menuItemController = require('../controllers/menuItem.controller');
const authMiddleware     = require('../middleware/auth.middleware');
const authorizeRoles     = require('../middleware/role.middleware');

// Only staff and owner can manage menu items
router.post('/',     authMiddleware, authorizeRoles('staff', 'owner'), menuItemController.createMenuItem);
router.put('/:id',   authMiddleware, authorizeRoles('staff', 'owner'), menuItemController.updateMenuItem);
router.delete('/:id',authMiddleware, authorizeRoles('staff', 'owner'), menuItemController.deleteMenuItem);

// Anyone can view menu items
router.get('/',      menuItemController.getAllMenuItems);
router.get('/:id',   menuItemController.getMenuItemById);

module.exports = router;
