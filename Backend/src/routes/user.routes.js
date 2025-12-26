const router = require("express").Router();
const user = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes
router.post("/", authorizeRoles("super_admin", "admin"), user.createUser);
router.put("/:id", authorizeRoles("super_admin", "admin"), user.updateUser);
router.delete("/:id", authorizeRoles("super_admin", "admin"), user.deleteUser);

module.exports = router;
