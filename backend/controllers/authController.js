import User from "../models/user.js";
import bcrypt from "bcryptjs";

export async function login(req, res, next) {
  try {
    const { id, password } = req.body;

    // Validate input
    if (!id || !password) {
      return res.status(400).json({
        message: "Both ID and password are required.",
        status_code: 0,
      });
    }

    // Find user by email or mobile
    const userExist = await User.findOne({
      $or: [{ email: id }, { mobile: id }],
    });

    // If user doesn't exist
    if (!userExist) {
      return res.status(400).json({
        message: "Invalid ID or password.",
        status_code: 0,
      });
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid ID or password.",
        status_code: 0,
      });
    }

    if (userExist.status === 0) {
      return res.status(400).json({ message: "Your Account is not active." });
    }

    // Generate a token
    const token = await userExist.generateToken();

    // Respond with success
    return res.status(200).json({
      message: "Login Successful.",
      token,
      photo: userExist.photo || null,
      status_code: 1,
    });
  } catch (error) {
    console.error("Error in login:", error);
    next(error);
  }
}

export async function register(req, res, next) {
  const {
    name,
    email,
    password = "Password",
    mobile,
    role = "student",
    method,
  } = req.body;

  try {
    // Validate input
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing email and mobile
    const [checkMail, checkMobile] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ mobile }),
    ]);

    if (checkMail) {
      return res.status(400).json({ message: "Email already registered." });
    }
    if (checkMobile) {
      return res.status(400).json({ message: "Mobile already registered." });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    // Save the user in the database
    await newUser.save();

    // Generate a token if needed and respond
    if (method === "admin") {
      res.status(200).json({
        message: "Registration Successful.",
        status_code: 1,
      });
    } else {
      const token = await newUser.generateToken();
      res.status(200).json({
        message: "Registration Successful.",
        token,
        userId: newUser._id.toString(),
        status_code: 1,
      });
    }
  } catch (error) {
    console.error("Error in register:", error);
    next(error);
  }
}

export async function registerByAdmin(req, res, next) {
  try {
    const { name, email, mobile, password = "Password", role } = req.body;

    console.log(role);

    if (role === "admin" || role === "student") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
        role,
      });
      await newAdmin.save();
      const users = await User.find({ role });
      return res
        .status(200)
        .json({ message: "User created Successfully", status_code: 1, users });
    } else {
      return res
        .status(200)
        .json({ message: "Role is missing", status_code: 0 });
    }
  } catch (error) {
    next(error);
  }
}
