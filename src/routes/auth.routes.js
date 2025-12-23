const router = require("express").Router();
const auth = require("../controllers/auth.controller");

router.post("/bootstrap-super-admin", auth.bootstrapSuperAdmin);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);

module.exports = router;
