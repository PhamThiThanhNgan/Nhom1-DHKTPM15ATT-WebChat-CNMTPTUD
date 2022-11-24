const { chatMiddleware } = require("../controllers/chatMiddleware");
const userController = require("../controllers/userController");
const router = require("express").Router();

router.route("/").get(chatMiddleware, userController.allUsers);
router.route("/friendRequest").post(chatMiddleware, userController.createFriendRequest);
router.route("/friendRequest").get(chatMiddleware, userController.allFriendRequest);
router.route("/response").post(chatMiddleware, userController.responseFriendRequest);
router.route("/unfriend").post(chatMiddleware, userController.unfriend);

module.exports = router;
