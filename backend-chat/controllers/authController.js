const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const sendEmail = require("../utils/sendEmail");

let refreshTokens = [];// 

const authController = {
     //REGISTER
     //method: post
     registerUser: asyncHandler(async (req, res) => {
          try {
               //mhmk
               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(req.body.password, salt);
               //tim user 
               const userName = await User.findOne({ username: req.body.username });
               const email = await User.findOne({ email: req.body.email });
               console.log(req.body);

               if (userName || email) {
                    res.status(401).json({ status: '401', message: "Tài khoản đã được đăng ký!" });
               } else {
                    //Create new user
                    const newUser = await new User({
                         username: req.body.username,
                         email: req.body.email,
                         password: hashed,
                    });

                    //Save user to DB
                    const user = await newUser.save();
                    res.status(200).json({ status: '200', message: "Thành công", data: user })
               }
          } catch (err) {
               res.status(500).json({ status: '500', message: "Internal Server Error", data: err });
          }
     }),

     generateAccessToken: (user) => {
          return jwt.sign(
               {
                    //mahoathongtin
                    id: user.id,
                    email: user.email,
                    username: user.username
               },
               process.env.JWT_ACCESS_KEY,
          );
     },

     //LOGIN
     loginUser: async (req, res) => {
          try {
               const user = await User.findOne({ email: req.body.email }).populate("friends", "-friends");
               if (!user) {
                    res.status(404).json({ status: '404', message: "Tài khoản không tồn tại!" });
               }
               //ma hoa password so sanh password tren database
               const validPassword = await bcrypt.compare(
                    req.body.password,
                    user.password
               );
               if (!validPassword) {
                    res.status(401).json({ status: '401', message: "Sai mật khẩu!" });
               }
               if (user && validPassword) {
                    //Generate access token
                    const accessToken = authController.generateAccessToken(user);
                    //sinh ra token gui chung data ve frontend
                    const { password, ...others } = user._doc;
                    res.status(200).json({ status: '200', message: "Thành công", data: { ...others, accessToken } });
               }
          } catch (err) {
               res.status(500).json(err);
          }
     },

     //get user info
     userInfo: async (req, res) => {
          try {
               const user = await User.findOne({ _id: req.user.id })
                    .populate("friends", "-friends");
               if (!user) {
                    return res.status(404).json({ status: '404', message: "Tài khoản không tồn tại!" });
               } else {
                    return res.status(200).json({ status: '200', message: "Thành công", data: user });
               }
          } catch (error) {
               return res.status(500).json(error);
          }
     },

     //xu ly token het han
     requestRefreshToken: async (req, res) => {
          //Take refresh token from user
          const refreshToken = req.cookies.refreshToken;
          //Send error if token is not valid
          if (!refreshToken) return res.status(401).json("You're not authenticated");
          if (!refreshTokens.includes(refreshToken)) {
               return res.status(403).json("Refresh token is not valid");
          }
          jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
               if (err) {
                    console.log(err);
               }
               refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
               //create new access token, refresh token and send to user
               const newAccessToken = authController.generateAccessToken(user);
               const newRefreshToken = authController.generateRefreshToken(user);
               refreshTokens.push(newRefreshToken);
               res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
               });
               res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
               });
          });
     },

     //LOG OUT(ko sd)
     logOut: async (req, res) => {
          //Clear cookies when user logs out
          refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
          res.clearCookie("refreshToken");
          res.status(200).json({ status: 'success', message: "Logged out successfully!" });
     },
     //send link mail
     sendMailForgot: async (req, res) => {
          try {
               let user = await User.findOne({ email: req.body.email });
               if (!user)
                    return res
                         .status(409)
                         .json({ message: "Người dùng với email đã cho không tồn tại!" });
               // hieu luc cua link
               const token = jwt.sign({ email: req.body.email, id: user._id }, process.env.JWT_ACCESS_KEY, {
                    expiresIn: "5m",
               });
               //dinh dang url trong email
               const url = `${process.env.BASE_URL}reset-password/${user._id}/${token}/`;
               await sendEmail(user.email, "Password Reset", url);

               res
                    .status(200)
                    .json({ message: "Đã gửi liên kết đặt lại mật khẩu đến tài khoản email của bạn" });
          } catch (error) {
               res.status(500).json({ message: "Internal Server Error" });
          }
     },
     resetPassword: async (req, res) => {
          const { id, token } = req.params;

          let user = await User.findOne({ _id: id });

          // ham xac thuc link send trong gmail.
          if (!user) return res.status(400).send({ message: "Liên kết không hợp lệ" });
          if (!token) return res.status(400).send({ message: "Liên kết không hợp lệ" });


          try {
               //ma hoa
               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(req.body.password, salt);
               await User.updateOne(
                    {
                         _id: id,
                    },
                    {
                         $set: {
                              password: hashed,
                         },
                    }
               );
               res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
          } catch (error) {
               console.log(error);
               res.status(500).json({ message: "Internal Server Error" });
          }
     },
     //update hinh anh
     updateImage: async (req, res) => {
          try {
               let port = process.env.PORT || process.env.HOST
               let { file } = req;

               let path = process.env.HOST + file.path.split("uploads/")[1];
               await User.findOneAndUpdate(
                    {
                         _id: req.body._id,
                    },
                    {
                         avatar: path
                    }
               );
               const user = await User.findOne(
                    {
                         _id: req.body._id,
                    }
               ).populate("friends", "-friends");
               return res.status(200).json({
                    status: 200,
                    message: "Thành công",
                    user,
               });
          } catch (err) {
               return res.status(400).json({
                    status: 400,
                    message: "Thay đổi thông tin thất bại",
               });
          }
     },
     updateName: async (req, res) => {
          try {

               await User.findOneAndUpdate(
                    {
                         _id: req.body._id,
                    },
                    {
                         username: req.body.username,
                    }
               );

               const user = await User.findOne(
                    {
                         _id: req.body._id,
                    }
               ).populate("friends", "-friends");

               return res.status(200).json({
                    status: 200,
                    message: "Thành công",
                    user,
               });

          } catch (err) {
               return res.status(400).json({
                    status: 400,
                    message: "Thay đổi thông tin thất bại",
               });
          }
     }
};

module.exports = authController;