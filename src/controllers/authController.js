const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey } = require("../config/secret");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User does not exist! Please register");
    }

    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched) {
      throw createError(404, "Incorrect password");
    }

    if (user.isBanned) {
      throw createError(403, "You're Banned! Contact Authority");
    }

    const accessToken = createJSONWebToken({ email }, jwtAccessKey, "10m");

    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return successResponse(res, {
      statusCode: 200,
      message: "User loggedin successful",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = handleLogin;
