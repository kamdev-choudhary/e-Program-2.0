import User from "../models/user.js";

export async function getAdminDashboardInfo(req, res, next) {
  try {
    const admins = await User.countDocuments({ role: "admin" });
    const students = await User.countDocuments({ role: "student" });
    const moderators = await User.countDocuments({ role: "moderator" });
    return res
      .status(200)
      .json({ message: "Data Found", admins, students, moderators });
  } catch (error) {
    next(error);
  }
}
