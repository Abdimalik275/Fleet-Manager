const express = require("express");
const router = express.Router();
const TruckController = require("../controllers/truck.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const authorizeRoles = require("../middlewares/authorizeRoles");

// All routes require authentication
router.use(authMiddleware);

// CREATE truck → superadmin or admin
router.post("/", authorizeRoles("super_admin", "admin"), TruckController.createTruck);

// GET all trucks → any authenticated user
router.get("/", TruckController.getAllTrucks);

// GET truck by ID → any authenticated user
router.get("/:id", TruckController.getTruckById);

// UPDATE truck → superadmin or admin
router.put("/:id", authorizeRoles("super_admin", "admin"), TruckController.updateTruck);

// DELETE truck → superadmin only
router.delete("/:id", authorizeRoles("super_admin"), TruckController.deleteTruck);



module.exports = router;
