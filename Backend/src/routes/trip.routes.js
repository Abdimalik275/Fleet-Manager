const express = require("express");
const {
  createTrip,
  updateTrip,
  completeTrip,
  getTrips,
  getTripById,
} = require("../controllers/trip.controller");

const auth = require("../middlewares/auth.middlewares");
const role = require("../middlewares/authorizeRoles");

const router = express.Router();

// All trip routes require authentication
router.use(auth);

// CREATE trip → admin, superadmin, operator
router.post("/", role(["admin", "superadmin", "operator"]), createTrip);

// GET all trips → any authenticated user
router.get("/", getTrips);

// GET trip by ID → any authenticated user
router.get("/:id", getTripById);

// UPDATE trip → admin, superadmin, operator
router.put("/:id", role(["admin", "superadmin", "operator"]), updateTrip);

// COMPLETE trip → admin, superadmin, operator
router.post("/:id/complete", role(["admin", "superadmin", "operator"]), completeTrip);

module.exports = router;