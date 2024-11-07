const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//CREATE ACCOUNT
const SignUp = async (req, res) => {
  //console.log("jeikfnklrklkrgkrmkr");
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Password must be at least 6 characters long.",
        });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashPassword,
    });
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60h",
      }
    );

    return res.status(200).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "Registration successfully",
    });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//LOGIN
const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Crendials" });
    }
    const AccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60h",
      }
    );
    return res.status(200).json({
      error: false,
      message: "Login Succesfully",
      user: {
        fullName: user.fullName,
        email: user.email,
      },
      AccessToken,
    });
  } catch (error) {
    console.log("Error in Login ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//GET USER
const GetUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
      return res.status(401);
    }
    return res.status(200).json({
      user: isUser,
      message: "",
    });
  } catch (error) {
    console.log("Error in get User ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

module.exports = { SignUp, Login, GetUser };
