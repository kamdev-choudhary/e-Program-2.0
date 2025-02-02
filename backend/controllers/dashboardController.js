import User from "../models/user.js";

export async function getAdminDashboardInfo(req, res, next) {
  try {
    const rolesCount = await User.aggregate([
      { $match: { role: { $in: ["admin", "scholar", "moderator"] } } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // Convert aggregation result into an object
    const counts = rolesCount.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    res.status(200).json({
      message: "Data Found",
      admins: counts.admin || 0,
      scholars: counts.scholar || 0,
      moderators: counts.moderator || 0,
    });
  } catch (error) {
    next(error);
  }
}
