const User = require("../models/User");
const asyncHandler = require('express-async-handler');
const FriendRequest = require("../models/FriendRequest");

const userController = {
    allUsers: asyncHandler(async (req, res) => {
        try {
            const keyword = req.query.search
                ? {
                    $or: [
                        { username: { $regex: req.query.search, $options: "i" } },
                        { email: { $regex: req.query.search, $options: "i" } },
                    ],
                }
                : {};

            const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
            res.send(users);
        } catch (err) {
            console.log(err);
        }
    }),

    //nhan vao nguoi gui{} va id nguoi nhan
    createFriendRequest: asyncHandler(async (req, res) => {
        try {
            const sender = await User.findOne({ _id: req.user._id });
            const receiver = await User.findOne({ _id: req.body.receiverId });


            if (!sender || !receiver) {
                return res
                    .status(404)
                    .send("Cannot find any user");
            } else {
                const haveFriendRequest = await FriendRequest.findOne({ receiverId: req.body.receiverId });
                const haveSenderFriendRequest = await FriendRequest.findOne({ receiverId: req.user._id });
                if (haveFriendRequest || haveSenderFriendRequest) {
                    return res
                        .status(422)
                        .send("Lời mời đã có sẵn");
                } else {
                    const friendRequest = await FriendRequest.create({
                        receiverId: req.body.receiverId,
                        sender: req.body.sender,
                    });
                    const fullFriendRequest = await FriendRequest.findOne({ _id: friendRequest._id })
                        .populate("sender", "-password");

                    res.status(200).json(fullFriendRequest);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }),

    allFriendRequest: asyncHandler(async (req, res) => {
        try {
            const friendRequest = await FriendRequest.find({ receiverId: req.user._id })
                .populate("sender", "-password")

            res.json(friendRequest);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }),

    responseFriendRequest: asyncHandler(async (req, res) => {
        try {
            const sender = await User.findOne({ _id: req.body.sender._id });
            const receiver = await User.findOne({ _id: req.user._id });
            const friendRequest = await FriendRequest.findOne({ _id: req.body._id });
            if (!sender || !receiver || !friendRequest) {
                return res
                    .status(404)
                    .send("Cannot find any friend request");
            } else {
                if (req.body.status === 'accept') {
                    await User.findOneAndUpdate(
                        {
                            _id: req.user._id,
                        },
                        { $push: { friends: sender } }
                    )
                    await User.findOneAndUpdate(
                        {
                            _id: req.body.sender._id,
                        },
                        { $push: { friends: receiver } }
                    )

                    await FriendRequest.deleteOne({ _id: req.body._id });
                    const receiveUser = await User.findOne({ _id: req.user._id });
                    return res
                        .status(200)
                        .send(receiveUser);
                } else {
                    await FriendRequest.deleteOne({ _id: req.body._id });
                    return res
                        .status(200)
                        .send(receiver);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }),

    unfriend: asyncHandler(async (req, res) => {
        try {
            const sender = await User.findOne({ _id: req.body._id });
            const receiver = await User.findOne({ _id: req.user._id });
            if (!sender || !receiver) {
                return res
                    .status(404)
                    .send("Cannot find any friend");
            } else {
                await User.findOneAndUpdate(
                    {
                        _id: req.user._id,
                    },
                    { $pull: { friends: req.body._id } }
                )

                await User.findOneAndUpdate(
                    {
                        _id: req.body._id,
                    },
                    { $pull: { friends: req.user._id } }
                )
                const receiveUser = await User.findOne({ _id: req.user._id });
                res.status(200).json(receiveUser);
                console.log(receiveUser);
            }
        } catch (err) {
            console.log(err);
        }
    }),
};

module.exports = userController;
