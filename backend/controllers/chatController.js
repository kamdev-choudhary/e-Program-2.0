const Chat = require("../models/chat");
const response = require("../utils/responses");

module.exports.getAllChats = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).json({ ...response.validation });
    }
    const chats = Chat.find({ _id: id });
    if (chats) {
      res.status(200).json({ chats, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
};
