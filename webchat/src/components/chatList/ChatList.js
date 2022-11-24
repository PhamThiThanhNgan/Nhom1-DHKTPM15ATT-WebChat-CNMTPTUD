import React, { useEffect, useState } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import { getAllChat } from "../../service/ChatService";
import { useUserStore } from "../../store/store";
import { getSender } from "../../utils";
import GroupChatModal from "../modal/GroupChatModal";

function ChatList() {

  // const [searchTerm, setSearchTerm] = useState('');
  const chats = useUserStore(state => state.chats);
  const setSelectedChat = useUserStore(state => state.setSelectedChat);
  const selectedChat = useUserStore(state => state.selectedChat);
  const updateChats = useUserStore(state => state.updateChats);
  const User = useUserStore(state => state.user);
  const [showModal, setShowModal] = useState(false);
 

  const handleShowModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getAllChat()
      .then((response) => {
        updateChats(response?.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [updateChats]);

  return (
    <>
      <div className="main__chatlist">
        <button className="btn-conversation " onClick={() => setShowModal(true)}>
          <i className="fa fa-plus"></i>
          <span>Thêm cuộc trò chuyện</span>
        </button>
        <div className="chatlist__heading">
          <h4>Tin Nhắn</h4>
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
        {/* <div className="chatList__search">
          <div className="search_wrap">
            <input
              value={searchTerm}
              type="text"
              placeholder=" Tìm kiếm cuộc trò chuyện"
              onChange={(e) => { setSearchTerm(e.target.value) }}
            />
            <button className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div> */}
        <div className="chatlist__items">
          {chats.map((item, index) => {
            return (
              <ChatListItems
                key={index}
                animationDelay={index + 1}
                user={getSender(User, item.users)}
                active={item?._id === selectedChat?._id ? "active" : ""}
                isOnline={item?.isOnline ? "active" : ""}
                handleSelectedChat={() => { setSelectedChat(item) }}
                chat={item}
              />
            );
          })}
        </div>
      </div>
      <GroupChatModal handleShowModal={handleShowModal} showModal={showModal} />
    </>
  );
}

export default ChatList;
