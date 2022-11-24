import React, { useEffect, useState } from "react";
import "../chatList/chatList.css";
import ChatListItems from "../chatList/ChatListItems";
// eslint-disable-next-line no-unused-vars
import { getAllChat, selectChat } from "../../service/ChatService";
import { useUserStore } from "../../store/store";
import { unfriend } from "../../service/UserService";
import { getMe } from "../../service/AuthService";

function FriendList() {

  const [searchTerm, setSearchTerm] = useState('');
  const chats = useUserStore(state => state.chats);
  const setSelectedChat = useUserStore(state => state.setSelectedChat);
  const selectedChat = useUserStore(state => state.selectedChat);
  const updateChats = useUserStore(state => state.updateChats);
  const User = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);
  const [friends, setFriends] = useState(User?.friends || []);

  const accessChat = (userId) => {
    selectChat(userId)
      .then((response) => {
        setSelectedChat(response?.data);
        if (!chats.find((item) => item._id === response?.data._id)) {
          updateChats([...chats, response?.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnfriend = (friend) => {
    unfriend(friend)
      .then((response) => {
        const filtered = friends.filter(item => item?._id !== friend?._id);
        setFriends(filtered);
        getMe()
          .then((response) => {
            updateUser(response?.data?.data);
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setSearchTerm(searchWord);
    const newFilter = friends.filter((value) => {
      return value.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        value.email.toLowerCase().includes(searchTerm.toLowerCase())
    });

    if (searchWord === "") {
      setFriends(User?.friends);
    } else {
      setFriends(newFilter);
    }
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
        <div className="chatlist__heading">
          <h4>Danh sách bạn</h4>
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
        <div className="chatList__search">
          <div className="search_wrap">
            <input
              value={searchTerm}
              type="text"
              placeholder=" Tìm kiếm bạn"
              onChange={handleFilter}
            />
            <button className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div className="chatlist__items">
          {friends.map((item, index) => {
            return (
              <ChatListItems
                key={index}
                animationDelay={index + 1}
                user={item}
                active={item?._id === selectedChat?._id ? "active" : ""}
                isOnline={item?.isOnline ? "active" : ""}
                handleSelectedChat={() => { accessChat(item?._id) }}
                chat={item}
                handleUnfriend={() => { handleUnfriend(item) }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FriendList;
