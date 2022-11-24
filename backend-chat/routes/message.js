const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { chatMiddleware } = require("../controllers/chatMiddleware");
const upload = require("../utils/uploader");

const router = express.Router();

router.route("/:chatId").get(chatMiddleware, allMessages);
router.route("/").post(chatMiddleware, upload.single('image'), sendMessage);
router.route("/delete").delete(chatMiddleware, deleteMessage);

module.exports = router;
