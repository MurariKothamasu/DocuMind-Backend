const express = require("express");
const { validateSignupData } = require("../utils/validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/admin");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // 2. If they do, send a clean 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please try to login."
      });
    }
    const newUser = await user.save();
    const token = await user.getJwt();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
      secure : true,
      sameSite : "none"
    });
    res.send(newUser);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving the user: " + error.message
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const isValidPassword = await user.validatePassword(password);
      if (isValidPassword) {
        const token = await user.getJwt();
        res.cookie("token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly : true,
          secure : true,
          sameSite : "none"

        });
        res.status(200).send(user);
      } else {
        throw new Error("Invalid Credentials");
      }
    }
  } catch (error) {
    res.status(400).send("ERROR : " + " " + error.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  res.clearCookie("token" , {
    httpOnly : true,
    secure : true,
    sameSite : "none"
  });
  res.send("Logged Out!!!!");
});

authRouter.get("/me", userAuth, (req, res) => {
  res.status(200).send(req.user);
});

module.exports = authRouter;
