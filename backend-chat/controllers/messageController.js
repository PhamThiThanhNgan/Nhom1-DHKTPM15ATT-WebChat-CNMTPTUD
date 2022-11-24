const asyncHandler = require('express-async-handler');
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { content, chatId } = req.body;
    let { file } = req;
    let path = '';
    if (file) {
      path = process.env.HOST + file.path.split("uploads/")[1];
    }

    if (!chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      image: path,
      chat: chatId,
    };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  };
});

const deleteMessage = asyncHandler(async (req, res) => {
  try {

    if (req.body.sender._id == req.user._id) {
      await Message.findOneAndDelete({ _id: req.body._id });
      return res.status(200).json({
        status: 200,
        message: "Delete message success",
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Can not find any sender",
      });
    }

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  };
});

module.exports = { allMessages, sendMessage, deleteMessage };