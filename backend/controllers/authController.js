import User from "../models/user.js";
import bcrypt from "bcryptjs";
import Batch from "../models/batch.js";
import { v4 as uuid } from "uuid";

export async function login(req, res, next) {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(200).json({
        message: "Both ID and password are required.",
        status_code: 0,
      });
    }
    const userExist = await User.findOne({
      $or: [{ email: id }, { mobile: id }],
    });

    // If user doesn't exist
    if (!userExist) {
      return res.status(200).json({
        message: "Invalid ID or password.",
        status_code: 0,
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        message: "Invalid ID or password.",
        status_code: 0,
      });
    }

    // Generate token
    const token = await userExist.generateToken();

    // Respond with success
    return res.status(200).json({
      message: "Login Successful.",
      token,
      userId: userExist._id.toString(),
      photo: userExist.photo || null,
      status_code: 1,
    });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  let { name, email, password = "Password", mobile, role, method } = req.body;

  try {
    let userExist = await findOne({ email: email });
    if (userExist) {
      return res
        .status(200)
        .json({ message: "Email already Registered", status_code: 2 });
    }
    let mobileExist = await findOne({ mobile: mobile });
    if (mobileExist) {
      return res
        .status(200)
        .json({ message: "Mobile number already Registered.", status_code: 2 });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
      role,
    });
    newUser.save();

    if (method === "admin") {
      res.status(200).json({
        message: "Registration Successful.",
        status_code: 1,
      });
    } else {
      res.status(200).json({
        message: "Registration Successful",
        token: await newUser.generateToken(),
        userId: newUser._id.toString(),
        status_code: 1,
      });
    }
  } catch (err) {
    next(error);
  }
}

export async function test(req, res, next) {
  try {
    res.status(200).json({ message: "Test" });
  } catch (error) {
    next(error);
  }
}
