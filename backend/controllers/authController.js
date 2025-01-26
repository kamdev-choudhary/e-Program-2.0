import User from "../models/user.js";
import bcrypt from "bcryptjs";
import Session from "../models/session.js";
import response from "../utils/responses.js";

export async function login(req, res, next) {
  try {
    const { user, sessionDetails } = req.body;

    const { id, password } = user;

    // Validate input
    if (!id || !password) {
      return res.status(400).json({
        ...response.validation("Both ID and Password is required"),
      });
    }

    // Find user by email or mobile
    const userExist = await User.findOne({
      $or: [{ email: id }, { mobile: id }],
    });

    // If user doesn't exist
    if (!userExist) {
      return res.status(400).json({
        ...response.notFound("User not found."),
      });
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        ...response.notFound("Invalid ID or Password"),
      });
    }

    if (userExist.status === 0) {
      return res
        .status(400)
        .json({ ...response.validation("Your account is Inactive.") });
    }

    // Generate a token
    const token = await userExist.generateToken();

    const newSession = new Session({
      token: token,
      userId: userExist._id,
      deviceId: sessionDetails.deviceId || "unknown",
      platform: sessionDetails.platform || "unknown",
      browser: sessionDetails.browser || "unknown",
      ip: sessionDetails.ip || "0.0.0.0",
    });

    await newSession.save();

    // Respond with success
    return res.status(200).json({
      token,
      photo: userExist.photo || null,
      ...response.success("Login Successfull"),
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
        ...response.success("Registration successfull."),
      });
    } else {
      const token = await newUser.generateToken();
      res.status(200).json({
        token,
        userId: newUser._id.toString(),
        ...response.success("Registration successfull."),
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
        .json({ ...response.success("User created Successfully."), users });
    } else {
      return res.status(200).json({ ...response.notFound("Role is missing") });
    }
  } catch (error) {
    next(error);
  }
}

export async function getLoginSesssion(req, res, next) {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ ...response.notFound("ID not found.") });
    const sessions = await Session.find({ userId: id });
    if (sessions) {
      return res
        .status(200)
        .json({ ...response.success("Session Found."), sessions });
    } else {
      return res.status(200).json({ ...response.error("Session not found") });
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteSession(req, res, next) {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ ...response.notFound("ID is missing.") });

    const deletedSession = await Session.deleteMany({ deviceId: id });
    if (deletedSession) {
      return res.status(200).json({ ...response.deleted("Session Deleted") });
    } else {
      return res
        .status(200)
        .json({ ...response.notFound("Session Not Found.") });
    }
  } catch (error) {
    next(error);
  }
}
