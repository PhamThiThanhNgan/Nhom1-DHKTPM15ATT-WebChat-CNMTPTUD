const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");
const path = require("path");
dotenv.config();

mongoose.connect(process.env.MONGODB_URL, ()=>{
     console.log("CONNECTED TO MONGODB");
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./uploads")));

app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/chat", chatRoute);
app.use("/v1/message", messageRoute);
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
     console.log(`App is running at http://localhost:${port}`);
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    console.log(newMessageRecieved);

    socket.to(chat?._id).emit("message recieved", newMessageRecieved);
    
    // chat.users.forEach((user) => {
    //   if (user._id == newMessageRecieved.sender._id) return;

    //   socket.in(user._id).emit("message recieved", newMessageRecieved);

    // });

  });

  socket.on("delete message", (messageDeleted) => {
    var chat = messageDeleted.chat;

    if (!chat.users) return console.log("chat.users not defined");

    socket.to(chat?._id).emit("message deleted", messageDeleted);

  }); 

  socket.on("new friend request", (newRequestRecieved) => {
    var sender = newRequestRecieved.sender;

    if (!sender) return console.log("sender not defined");

    console.log('request: ', newRequestRecieved);
    socket
      .to(newRequestRecieved?.receiverId)
      .emit("request recieved", newRequestRecieved);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});