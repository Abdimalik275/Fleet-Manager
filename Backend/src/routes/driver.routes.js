const express = require('express');
const router = express.Router();

const DriverController = require('../controllers/driver.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const authorizeRole = require('../middlewares/authorizeRoles');

// All routes require authentication
router.use(authMiddleware);

// Create driver — only superadmin or admin
router.post(
  '/',
  authorizeRole(['superadmin', 'admin']),
  DriverController.createDriver
);

// Get all drivers — any authenticated user
router.get('/', DriverController.getDrivers);

// Get driver by ID — any authenticated user
router.get('/:id', DriverController.getDriverById);

// Update driver — only superadmin or admin
router.put(
  '/:id',
  authorizeRole(['superadmin', 'admin']),
  DriverController.updateDriver
);

// Delete driver — only superadmin or admin
router.delete(
  '/:id',
  authorizeRole(['superadmin', 'admin']),
  DriverController.deleteDriver
);

module.exports = router;
