const express = require('express');
const router = express.Router();
const TruckController = require('../controllers/truck.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const authorizeRoles = require('../middlewares/authorizeRoles');

// =========================
// ALL TRUCK ROUTES REQUIRE AUTHENTICATION
// =========================
router.use(authMiddleware);

// =========================
// CREATE TRUCK
// Only super_admin or admin can create a truck
// Request can include optional driver info
// =========================
router.post(
  '/',
  authorizeRoles('super_admin', 'admin'),
  TruckController.createTruck
);

// =========================
// GET ALL TRUCKS
// Any authenticated user can view trucks
// Optional: filter by status using query ?status=available
// =========================
router.get('/', TruckController.getAllTrucks);

// =========================
// GET TRUCK BY ID
// Any authenticated user can view a single truck
// =========================
router.get('/:id', TruckController.getTruckById);

// =========================
// UPDATE TRUCK
// Only super_admin or admin can update truck details
// =========================
router.put(
  '/:id',
  authorizeRoles('super_admin', 'admin'),
  TruckController.updateTruck
);

// =========================
// DELETE TRUCK
// Only super_admin can delete a truck
// =========================
router.delete(
  '/:id',
  authorizeRoles('super_admin'),
  TruckController.deleteTruck
);

// =========================
// ASSIGN OR CHANGE DRIVER
// Only super_admin or admin can assign/change driver
// Request body should include driver object
// Example:
// {
//   "driver": {
//       "name": "John Doe",
//       "phone": "0712345678"
//   }
// }
// =========================
router.post(
  '/:id/assign-driver',
  authorizeRoles('super_admin', 'admin'),
  TruckController.assignDriver
);

module.exports = router;
