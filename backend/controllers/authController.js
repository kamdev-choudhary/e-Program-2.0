import User from "../models/user.js";
import bcrypt from "bcryptjs";
import Session from "../models/session.js";

export async function login(req, res, next) {
  try {
    const { user, sessionDetails } = req.body;
    const { id, password } = user;

    if (!id || !password) {
      return res
        .status(400)
        .json({ message: "Both ID and Password are required." });
    }

    const userExist = await User.findOne({
      $or: [{ email: id }, { mobile: id }],
    });

    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid ID or Password" });
    }

    if (userExist.status === 0) {
      return res.status(400).json({ message: "Your account is Inactive." });
    }

    const token = await userExist.generateToken();
    const refreshToken = await userExist.generateRefreshToken();

    const newSession = new Session({
      token,
      refreshToken,
      userId: userExist._id,
      deviceId: sessionDetails?.deviceId || "unknown",
      platform: sessionDetails?.platform || "unknown",
      browser: sessionDetails?.browser || "unknown",
      ip: sessionDetails?.ip || "0.0.0.0",
    });

    await newSession.save();

    return res.status(200).json({
      refreshToken,
      token,
      photo: userExist.photo || null,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Error in login:", error);
    return next(error);
  }
}

export async function register(req, res, next) {
  try {
    const {
      name,
      email,
      password = "Password",
      mobile,
      role = "scholar",
      method,
    } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [checkMail, checkMobile] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ mobile }),
    ]);

    if (checkMail)
      return res.status(400).json({ message: "Email already registered." });
    if (checkMobile)
      return res.status(400).json({ message: "Mobile already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
    });
    await newUser.save();

    if (method === "admin") {
      return res.status(201).json({ message: "Registration successful." });
    } else {
      const token = await newUser.generateToken();
      const refreshToken = await newUser.generateRefreshToken();
      return res.status(201).json({
        token,
        refreshToken,
        userId: newUser._id.toString(),
        message: "Registration successful.",
      });
    }
  } catch (error) {
    console.error("Error in register:", error);
    return next(error);
  }
}

export async function registerByAdmin(req, res, next) {
  try {
    const { name, email, mobile, password = "Password", role } = req.body;

    if (!role || !["admin", "scholar", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role." });
    }

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
      .status(201)
      .json({ message: "User created successfully.", users });
  } catch (error) {
    return next(error);
  }
}

export async function getLoginSession(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID not found." });

    const sessions = await Session.find({ userId: id });

    return res.status(200).json({
      message: sessions.length ? "Session Found." : "Session not found",
      sessions,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteSession(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID is missing." });

    const deletedSession = await Session.deleteMany({ deviceId: id });

    if (deletedSession.deletedCount > 0) {
      return res.status(200).json({ message: "Session Deleted." });
    } else {
      return res.status(404).json({ message: "Session Not Found." });
    }
  } catch (error) {
    return next(error);
  }
}

export async function deleteAllSession(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID is missing." });
    const deletedSession = await Session.deleteMany({ userId: id });

    if (deletedSession.deletedCount > 0) {
      return res.status(200).json({ message: "Session Deleted." });
    } else {
      return res.status(404).json({ message: "Session Not Found." });
    }
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    // Retrieve the refresh token from the "x-refresh-token" header
    const refreshToken = req.headers["x-refresh-token"];

    // Check that a refresh token is provided
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    // Look up the session associated with the provided refresh token
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    // Optionally: Check if the session has expired
    // if (session.expiresAt && session.expiresAt < Date.now()) {
    //   return res.status(401).json({ message: "Refresh token has expired." });
    // }

    // Find the user associated with the session
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new access token for the user.
    // This assumes that your User model has a method `generateToken()` that returns a promise.
    const accessToken = await user.generateToken();

    // Optionally, if you wish to rotate the refresh token, generate a new one, update the session, and return it:
    // const newRefreshToken = await user.generateRefreshToken();
    // session.refreshToken = newRefreshToken;
    // await session.save();
    // return res.status(200).json({ accessToken, refreshToken: newRefreshToken });

    // Return the new access token
    return res.status(200).json({ accessToken });
  } catch (error) {
    return next(error);
  }
}
