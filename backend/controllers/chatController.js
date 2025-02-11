import Chat from "../models/chat.js";
import Message from "../models/message.js";

export async function getAllChats(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "validation error", message: "User ID is required" });
    }

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
      res.status(200).json({ chats: modifiedChats, message: "Success" });
    } else {
      res.status(404).json({
        message: "validation error",
        message: "No chats found for this user",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function createChat(req, res, next) {
  try {
    const { id1, id2, content } = req.body;

    // Check if both participant IDs are provided
    if (!id1 || !id2 || !content) {
      return res.status(400).json({
        message: "validation error",
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
    });
  } catch (error) {
    next(error);
  }
}

export async function sendChat(req, res, next) {
  try {
    const { id1, id2, content, groupId, page = 1 } = req.body;
    const limit = 10;
    const skip = (page - 1) * 10;
    const newMessage = new Message({
      sender: id1,
      receiver: id2,
      groupId: groupId,
      content: content,
    });
    await newMessage.save();
    const messages = await Message.find({ groupId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({ messages, message: "Message Send Successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { id } = req.params;
    const messages = await find({ groupId: id }).lean(); // Await the query to get data
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    next(error);
  }
}
