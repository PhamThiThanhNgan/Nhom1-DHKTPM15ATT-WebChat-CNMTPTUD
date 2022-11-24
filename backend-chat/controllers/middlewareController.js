const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const middlewareController = {
     //verifyToken
     verifyToken: asyncHandler(async (req, res, next) => {
          const token = req.header("Authorization").replace("Bearer ", "");
          if (token) {
               jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (err) {
                         res.status(403).json({ status: '403', message: "Token không hợp lệ!" });
                    }
                    req.user = user;
                    next();
               });
          } else {
               res.status(403).json({ status: '403', message: "Từ chối quyền truy cập!" });
          }
     }),
};

module.exports = middlewareController;