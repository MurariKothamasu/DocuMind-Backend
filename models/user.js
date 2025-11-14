const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//User Database Model , it will define What are the fields that are present in out Database 
//This also Provide a Schema Level Validation
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
    }
  }
  
);


// JWT Token Generation When User Signin Or Login to The Website
userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// password Validator That will Compare the Password that are Stored in DataBase and Coming from Fontend
// at the Time of Login
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(password, passwordHash);
  return isValidPassword;
};



const User = mongoose.model("User", userSchema);

module.exports = { User };
