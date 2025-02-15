import User from "../models/user.js";
import bcrypt from "bcryptjs";
import Session from "../models/session.js";
import logger from "../utils/logger.js";

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
    }).select("_id role name email mobile password ");

    console.log(userExist);

    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await userExist.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid ID or Password" });
    }

    if (userExist.status === 0) {
      return res.status(400).json({ message: "Your account is Inactive." });
    }

    const token = await userExist.generateToken();
    const refreshToken = await userExist.generateRefreshToken();

    const activeSessions = await Session.countDocuments({
      userId: userExist._id,
    });

    if (activeSessions >= 5) {
      await Session.deleteOne(
        { userId: userExist._id },
        { sort: { loginTime: 1 } }
      );
    }

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
    const refreshToken = req.headers["x-refresh-token"];

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    logger.log(`Token generated for ${user._id}`);

    const accessToken = await user.generateToken();

    return res.status(200).json({ accessToken });
  } catch (error) {
    return next(error);
  }
}
