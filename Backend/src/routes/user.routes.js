const router = require("express").Router();
const user = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Apply authentication middleware
router.use(authMiddleware);

// =======================
// CRUD routes
// =======================

// Create user → Only Super Admin & Admin
router.post("/", authorizeRoles("super_admin", "admin"), user.createUser);

// Update user → Only Super Admin & Admin
router.put("/:id", authorizeRoles("super_admin", "admin"), user.updateUser);

// Delete user → Only Super Admin & Admin
router.delete("/:id", authorizeRoles("super_admin", "admin"), user.deleteUser);

// =======================
// GET routes
// =======================

// Get all users → Super Admin & Admin
router.get("/", authorizeRoles("super_admin", "admin"), user.getAllUsers);

// Get user by ID → Super Admin & Admin
router.get("/:id", authorizeRoles("super_admin", "admin"), user.getUserById);

module.exports = router;
