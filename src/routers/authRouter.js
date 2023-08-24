const express = require("express");

const { runValidation } = require("../validation");
const handleLogin = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/login", handleLogin);

module.exports = authRouter;
