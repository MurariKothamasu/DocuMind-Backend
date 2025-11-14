const express = require("express");
const { validateSignupData } = require("../utils/validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/admin");

const authRouter = express.Router();


//Signup Route ->  Take 4 parameters Firstname  , Lastname , email , password
//this signup route will take this 4 parameters and stores into database
//
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;


    //Hashing password to Provide better Security
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });


    //check for Existing User Based on Emial 
    const existingUser = await User.findOne({ email: email });

    //error Handling for existing Email error
    if (existingUser) {
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

    //other error Handling Like -> network Error , or server Side Errors
    res.status(500).json({
      success: false,
      message: "Error saving the user: " + error.message
    });
  }
});


//Login Route -> Takes email and password and Check it in the database and find the specific user
//then return that Specific User to the frontend
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {

      //this is used to Validate Password -> Refer User Model for Better understanding
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


//Logout Route > This will clear the The cookies and JWT token in frontend 
authRouter.post("/logout", userAuth, async (req, res) => {
  res.clearCookie("token" , {
    httpOnly : true,
    secure : true,
    sameSite : "none"
  });
  res.send("Logged Out!!!!");
});


//this is /me Route which Checks for UserLogin Activity and When pageRfresh It will call this route and get the UserData and it will make the website to stay on the current page when refreshing the page
authRouter.get("/me", userAuth, (req, res) => {
  res.status(200).send(req.user);
});

module.exports = authRouter;
