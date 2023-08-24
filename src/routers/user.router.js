const express = require("express");
const {
  testController,
  getUsers,
  findUserById,
  deleteUser,
  processRegister,
  activateUserAccount,
  updateUser,
} = require("../controllers/user.controller");
const upload = require("../middlewares/uploadFiles");
const { validateUserRegister } = require("../validation/auth");
const { runValidation } = require("../validation");

const router = express.Router();

router.get("/test", testController);
router.get("/users", getUsers);
router.post(
  "/process-register",
  validateUserRegister,
  runValidation,
  upload.single("image"),
  processRegister
);
router.post("/api/verify", activateUserAccount);
router.get("/:id", findUserById);
router.delete("/:id", deleteUser);
router.put("/:id", upload.single("image"), updateUser);

module.exports = router;
