const express = require('express');
const router = express.Router();
const TruckController = require('../controllers/truck.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const authorizeRoles = require('../middlewares/authorizeRoles');

// All truck routes require authentication
router.use(authMiddleware);

// CREATE truck → only superadmin or admin
router.post(
  '/',
  authorizeRoles('super_admin', 'admin'),
  TruckController.createTruck
);

// GET all trucks → any authenticated user
router.get('/', TruckController.getAllTrucks);

// GET truck by ID → any authenticated user
router.get('/:id', TruckController.getTruckById);

// UPDATE truck → only superadmin or admin
router.put(
  '/:id',
  authorizeRoles('super_admin', 'admin'),
  TruckController.updateTruck
);

// DELETE truck → only superadmin
router.delete(
  '/:id',
  authorizeRoles('super_admin'),
  TruckController.deleteTruck
);

// ASSIGN driver to truck → only superadmin or admin
router.post(
  '/:id/assign-driver',
  authorizeRoles('super_admin', 'admin'),
  TruckController.assignDriver
);

module.exports = router;
