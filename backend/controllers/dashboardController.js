import User from "../models/user.js";

export async function getAdminDashboardInfo(req, res, next) {
  try {
    const admins = await User.countDocuments({ role: "admin" });
    const scholars = await User.countDocuments({ role: "scholar" });
    const moderators = await User.countDocuments({ role: "moderator" });
    return res
      .status(200)
      .json({ message: "Data Found", admins, scholars, moderators });
  } catch (error) {
    next(error);
  }
}
