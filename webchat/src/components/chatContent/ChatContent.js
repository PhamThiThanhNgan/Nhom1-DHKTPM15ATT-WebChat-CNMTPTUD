import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import "./chatContent.css";
import io from "socket.io-client";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import { useUserStore } from "../../store/store";
import { deleteMessage, getAllMessage, sendMessage } from "../../service/ChatService";
import Loading from "../Loading/Loading";
import { ReactComponent as UploadImage } from '../../asset/svg/UploadImage.svg';
import EmojiPicker from "emoji-picker-react";
import GroupChatModal from "../modal/GroupChatModal";

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const ChatContent = ({ fetchAgain, setFetchAgain }) => {
  const titleRef = useRef()
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const selectedChat = useUserStore(state => state.selectedChat);
  const User = useUserStore(state => state.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const handleShowModal = () => {
    setShowModal(false);
  };

  const onEmojiClick = (emojiObject, event) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const getUserImage = (users, senderId) => {
    const result = users.find(user => user._id === senderId);
    return result?.avatar;
  };

  const handleSendImage = async (event) => {
      sendMessage({ content: newMessage, chatId: selectedChat?._id, image: event.target.files[0]})
        .then((response) => {
          setImage("");
          socket.emit("new message", response?.data);
          setMessages([...messages, response?.data]);
        })
        .catch((error) => {
          console.error(error);
        })
  };

  const handleDeleteMessage = (message) => {
    deleteMessage(message)
      .then((response) => {
        socket.emit("delete message", message);
        const filtered = messages.filter((item) => item?._id !== message?._id);
        setMessages(filtered);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      sendMessage({ content: newMessage, chatId: selectedChat?._id })
        .then((response) => {
          setNewMessage("");
          socket.emit("new message", response?.data);
          setMessages([...messages, response?.data]);
        })
        .catch((error) => {
          console.error(error);
        })
    }
  };

  useEffect(() => {
    if (!_.isEmpty(selectedChat)) {
      getAllMessage(selectedChat?._id)
        .then((response) => {
          setMessages(response?.data);
          socket.emit("join chat", selectedChat._id);
        })
        .catch((error) => {
          console.log('error', error);
        })
  
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", User);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // if (
      //   !selectedChatCompare || // if chat is not selected or doesn't match current chat
      //   selectedChatCompare._id !== newMessageRecieved.chat._id
      // ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessa geRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      // } else {
        // }
      setMessages([...messages, newMessageRecieved]);
    });
  }, [messages]);

  useEffect(() => {
    socket.on("message deleted", (messageDeleted) => {
      if (messageDeleted) {
        const filtered = messages.filter(item => item?._id !== messageDeleted?._id);
        
        setMessages(filtered);
      }
    });
  }, [messages]);

  useEffect(() => {
    titleRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="main__chatcontent">
      {
        _.isEmpty(selectedChat)
          ? <>
            <h1>Chào mừng đến với Chat App!</h1>
            <div ref={titleRef} />
          </>
          : <>
            <div className="content__header">
              <div className="blocks">
                <div className="current-chatting-user">
                  {
                    !selectedChat.isGroupChat
                      ? (
                        <>
                        <Avatar
                          isOnline="active"
                          image={selectedChat?.users[0]?._id === User?._id ? selectedChat?.users[1]?.avatar : selectedChat?.users[0]?.avatar}
                        />
                        <p>{selectedChat?.users[0]._id === User._id ? selectedChat?.users[1]?.username : selectedChat?.users[0]?.username}</p>
                        </>
                      )
                        : (
                          <p>{selectedChat?.chatName}</p>
                      )
                  }
                </div>
              </div>

              <div className="blocks">
                <div className="settings">
                  <button className="btn-nobg" onClick={() => {
                    if(selectedChat?.isGroupChat === true) setShowModal(true)
                  }}>
                    <i className="fa fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="content__body">
              <div className="chat__items">
                {messages && messages.map((item, index) => {
                  return (
                    <ChatItem
                      animationDelay={index + 2}
                      key={index}
                      user={item?.sender?._id === User?._id ? "me" : "other"}
                      msg={item?.content}
                      imgMessage={item?.image}
                      // image={item?.sender?._id === User?._id ? selectedChat?.users[0]?.avatar : selectedChat?.users[1]?.avatar}
                      image={getUserImage(selectedChat?.users, item?.sender?._id)}
                      deleteMessage={() => { handleDeleteMessage(item) }}
                    />
                  );
                })}
                <div ref={titleRef} />
              </div>
            </div>
            <div className="content__footer">
              {showPicker && <EmojiPicker
                pickerStyle={{ width: '100%' }}
                className="emoji-picker"
                onEmojiClick={onEmojiClick} />}
              {istyping ? <Loading /> : <></>}
              <div className="sendNewMessage">
                <input style={{ display: 'none' }} id='uploadImage' type='file' accept='image/*' onChange={handleSendImage}/>
                <label htmlFor='uploadImage' className="addFiles">
                  <UploadImage />
                </label>
                <input
                  onKeyDown={handleSendMessage}
                  type="text"
                  placeholder="Nhập để gửi..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <button className="btnSendMsg" id="sendMsgBtn" onClick={() => setShowPicker(val => !val)}>
                  <i className="fa-solid fa-face-smile"></i>
                </button>
              </div>
            </div>
          </>
      }
      <GroupChatModal
        handleShowModal={handleShowModal}
        showModal={showModal}
        groupChatData={selectedChat}
      />
    </div>
  );
}

export default ChatContent;
