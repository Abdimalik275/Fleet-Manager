const express = require("express");
const {
  createRepair,
  approveRepair,
  rejectRepair,
  updateRepair,
  deleteRepair,
  getRepairs,
  getRepairById,
} = require("../controllers/repair.controller");

const auth = require("../middlewares/auth.middlewares"); 
const role = require("../middlewares/authorizeRoles"); 

const router = express.Router();

// ============================
// All routes require authentication
// ============================
router.use(auth);

/**
 * @route   POST /api/repairs
 * @desc    Create a new repair
 * @access  Admin, Superadmin, Operator
 */
router.post("/", role(["admin", "superadmin", "operator"]), createRepair);

/**
 * @route   GET /api/repairs
 * @desc    Get all repairs
 * @access  Any authenticated user
 */
router.get("/", getRepairs);

/**
 * @route   GET /api/repairs/:id
 * @desc    Get single repair by ID
 * @access  Any authenticated user
 */
router.get("/:id", getRepairById);

/**
 * @route   PUT /api/repairs/:id
 * @desc    Update repair details
 * @access  Admin, Superadmin, Operator
 * Only pending repairs can be updated
 */
router.put("/:id", role(["admin", "superadmin", "operator"]), updateRepair);

/**
 * @route   POST /api/repairs/:id/approve
 * @desc    Approve a repair
 * @access  Admin, Superadmin
 */
router.post("/:id/approve", role(["admin", "superadmin"]), approveRepair);

/**
 * @route   POST /api/repairs/:id/reject
 * @desc    Reject a repair
 * @access  Admin, Superadmin
 */
router.post("/:id/reject", role(["admin", "superadmin"]), rejectRepair);

/**
 * @route   DELETE /api/repairs/:id
 * @desc    Delete a repair
 * @access  Admin, Superadmin
 */
router.delete("/:id", role(["admin", "superadmin"]), deleteRepair);

module.exports = router;
