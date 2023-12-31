const User = require("../models/user.model");
const fs = require("fs");
const { findUserId } = require("../services/find-services");
const { successResponse } = require("./response.controller");
const createError = require("http-errors");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtKey, clientURL } = require("../config/secret");
const sendEmailWithNodMailer = require("../helper/email");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const testController = (req, res) => {
  res.status(200).send({
    message: "working fine",
  });
};

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegEx = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: false,
      $or: [
        { name: { $regex: searchRegEx } },
        { email: { $regex: searchRegEx } },
        { phone: { $regex: searchRegEx } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await User.find(filter).countDocuments();
    if (!users) {
      throw new Error(404, "no user found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User sucessful returned",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPAge: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const findUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User sucessful returned",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserId(User, id, options);

    const userImagePath = user.image;
    if (userImagePath) {
      fs.access(userImagePath, (err) => {
        if (err) {
          console.log("user image not found");
        } else {
          fs.unlink(userImagePath, (err) => {
            if (err) {
              throw err;
            }
            console.log("user image deleted!");
          });
        }
      });
    }
    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "User deleted sucessful",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }
    console.log(image);

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large less then 2MB");
    }

    const imageBufferString = image.buffer.toString("base64");

    // Check if user already exists
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "User email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    // const newUser = new User({
    //     name,
    //     email,
    //     password: hashedPassword,
    //     phone,
    //     address
    // });

    // await newUser.save();

    // Generate token after creating the user
    const token = createJSONWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtKey,
      "10m"
    );

    // Send verification email
    const emailData = {
      email,
      subject: "Activate Your Account",
      html: `
                <h2>Hello ${name}!!</h2> 
                <p>Click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p> 
            `,
    };
    try {
      await sendEmailWithNodMailer(emailData);
    } catch (emailError) {
      throw createError(500, "Failed to send verification email");
    }

    // Respond with success message
    return successResponse(res, {
      statusCode: 200,
      message: `Check your ${email} to complete registration`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      throw createError(404, "Token not found");
    }
    const decoded = jwt.verify(token, jwtKey);
    if (!decoded) {
      throw createError(401, "Unable to verify user");
    }
    const userExists = await User.exists({ email: decoded.email });
    if (userExists) {
      throw createError(409, "User email already exists! please sign in");
    }

    await User.create(decoded);
    return successResponse(res, {
      statusCode: 200,
      message: "You're Account was register successfully!!",
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findUserId(User, userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    // if (req.body.name) {
    //   updates.name = req.body.name;
    // }
    // if (req.body.password) {
    //   updates.password = req.body.password;
    // }
    // if (req.body.phone) {
    //   updates.phone = req.body.phone;
    // }
    // if (req.body.address) {
    //   updates.address = req.body.address;
    // }

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw new Error("Email can not be updated");
      }
    }
    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw new Error("File is too large less then 2MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    // delete updates.email;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User with this id does not exists");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processRegister,
  testController,
  getUsers,
  findUserById,
  deleteUser,
  activateUserAccount,
  updateUser,
};
