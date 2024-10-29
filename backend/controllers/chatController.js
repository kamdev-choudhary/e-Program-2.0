const Chat = require("../models/chat");
const Message = require("../models/message");
const response = require("../utils/responses");

module.exports.getAllChats = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ ...response.validation, message: "User ID is required" });
    }

    // Find chats where the user is a participant and populate participants
    const chats = await Chat.find({ participants: { $in: [id] } })
      .populate("participants", "name email _id") // Populate fields as needed
      .lean();

    // Modify each chat to include only the other participant as `participant`
    const modifiedChats = chats.map((chat) => {
      const otherParticipants = chat.participants.filter(
        (participant) => participant._id.toString() !== id
      );
      return {
        ...chat,
        participant: otherParticipants[0] || null, // Set the single other participant or null if none
      };
    });

    if (modifiedChats.length > 0) {
      res.status(200).json({ chats: modifiedChats, ...response.success });
    } else {
      res.status(404).json({
        ...response.notFound,
        message: "No chats found for this user",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.createChat = async (req, res, next) => {
  try {
    const { id1, id2, content } = req.body;

    // Check if both participant IDs are provided
    if (!id1 || !id2 || !content) {
      return res.status(400).json({
        ...response.validation,
        message: "Participants and content are required.",
      });
    }

    // Check if a chat between these two participants already exists
    let chat = await Chat.findOne({ participants: { $all: [id1, id2] } });

    if (!chat) {
      // Create new chat if it does not exist
      chat = new Chat({ participants: [id1, id2] });
      await chat.save();
    }

    // Create new message linked to the chat
    const newMessage = new Message({
      sender: id1,
      receiver: id2,
      content: content,
      groupId: chat._id,
    });

    // Save the message
    await newMessage.save();

    let chats = await Chat.find({ participants: { $all: [id1, id2] } });
    // Respond with success and chat and message details
    res.status(200).json({
      chats,
      ...response.success,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.sendChat = async (req, res, next) => {
  try {
    const { id1, id2, content, groupId } = req.body;
    const newMessage = new Message({
      sender: id1,
      receiver: id2,
      groupId: groupId,
      content: content,
    });
    await newMessage.save();
    const messages = await Message.find({ groupId });
    res
      .status(200)
      .json({ messages, messgae: "Message send Successfully", status_code: 1 });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ groupId: id }).lean(); // Await the query to get data
    res.status(200).json({ messages, ...response.success });
  } catch (error) {
    res.status(500).json({ message: "Server error", ...response.serverError });
    next(error);
  }
};
