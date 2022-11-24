const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
     "username": {
          type: String,
          required: true,
          minLength: 6,
          maxLength: 20,
          unique: true
     },
     "avatar": {
          type: String,
          required: false,
          default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
     },
     "email": { 
          type: String,
          required: true,
          minLength: 10,
          maxLength: 50,
          unique: true
     },
     "password": {
          type: String,
          required: true,
          minLength: 6,
     },
     friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {"timestamps": true}
);

module.exports = mongoose.model("User", userSchema);
