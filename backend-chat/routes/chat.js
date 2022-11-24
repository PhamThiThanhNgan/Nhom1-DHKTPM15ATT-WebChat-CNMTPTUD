const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatController");
const { chatMiddleware } = require("../controllers/chatMiddleware");
const middlewareController = require("../controllers/middlewareController");

const router = express.Router();

router.route("/").post(chatMiddleware, accessChat);
router.route("/").get(chatMiddleware, fetchChats);
router.route("/group").post(chatMiddleware, createGroupChat);
router.route("/rename").put(chatMiddleware, renameGroup);
router.route("/groupremove").put(chatMiddleware, removeFromGroup);
router.route("/groupadd").put(chatMiddleware, addToGroup);

module.exports = router;
