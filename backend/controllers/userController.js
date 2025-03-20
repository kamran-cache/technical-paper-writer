const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const SECRET_KEY = "CacheLabs112323"; // Change this to your secret key

// Register a new user
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: "6h" }
    );
    res.status(201).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, "user");

  try {
    // Check if the user exists
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "6h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    if (!userId) return res.status(401).json("User not found!! ");
    const user = await Users.findById(userId)
      .select("-password")
      .populate("papers");
    console.log(user, 123);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ "error in finding user": error });
  }
};

module.exports = { signup, login, getUser };
