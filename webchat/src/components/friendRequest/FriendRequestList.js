import React, { useEffect, useState } from "react";
import "../chatList/chatList.css";
// import ChatListItems from "../chatList/ChatListItems";
// import { getAllChat } from "../../service/ChatService";
import { useUserStore } from "../../store/store";
// import { getSender } from "../../utils";
import { Offcanvas } from "react-bootstrap";
import io from "socket.io-client";
// eslint-disable-next-line no-unused-vars
import { getAllUser, selectChat } from "../../service/ChatService";
import UserItem from "../userItem/userItem";
import { getAllRequest, responseRequest, sendFriendRequest } from "../../service/UserService";
import { toast } from 'react-toastify';
import FriendRequestItem from "./FriendRequestItem";
import { getMe } from "../../service/AuthService";

var socket;
const ENDPOINT = "http://localhost:8000";

function FriendRequestList() {

     const [searchTerm, setSearchTerm] = useState('');
     // const chats = useUserStore(state => state.chats);
     // const setSelectedChat = useUserStore(state => state.setSelectedChat);
     // const selectedChat = useUserStore(state => state.selectedChat);
     // const updateChats = useUserStore(state => state.updateChats);
     const User = useUserStore(state => state.user);
     const [showDrawer, setShowDrawer] = useState(false);
     const [users, setUsers] = useState([]);
     const [requests, setRequests] = useState([]);
     const updateUser = useUserStore(state => state.updateUser);

     // const accessChat = (userId) => {

     //      selectChat(userId)
     //           .then((response) => {
     //                setSelectedChat(response?.data);
     //                if (!chats.find((item) => item._id === response?.data._id)) {
     //                     updateChats([...chats, response?.data]);
     //                }
     //                setShowDrawer(false);
     //           })
     //           .catch((error) => {
     //                console.log(error);
     //           });
     // }

     const addFriend = (userId) => {

          const haveFriend = User.friends.find(item => item._id === userId);

          if (haveFriend) {
               toast('Người này và bạn đã là bạn bè', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
               });
          } else {
               sendFriendRequest({ receiverId: userId, sender: User })
                    .then((response) => {
                         toast('Gửi lời mời thành công', {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "dark",
                         });
                         socket.emit("new friend request", response?.data);
                         setShowDrawer(false);
                    })
                    .catch((error) => {
                         toast(error?.response?.data, {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "dark",
                         });
                    });
          }
     };

     const handleResponse = (request, status) => {
          responseRequest({ ...request, status })
               .then((response) => {
                    getMe()
                         .then((response) => {
                              updateUser(response?.data?.data);
                         })
                         .catch((err) => {
                              console.log(err);
                         })
                    const filtered = requests.filter(item => item?._id !== request?._id);
                    setRequests(filtered);
               })
               .catch((error) => {
                    console.log(error);
               });
     };

     useEffect(() => {
          socket = io(ENDPOINT);
          socket.emit("setup", User);
     }, []);

     useEffect(() => {
          getAllRequest()
               .then((response) => {
                    setRequests(response?.data);
               })
               .catch((error) => {
                    console.log(error);
               })
     }, []);

     useEffect(() => {
          socket.on("request recieved", (newRequestRecieved) => {

               setRequests([...requests, newRequestRecieved]);

               toast(`Bạn nhận được một lời kết bạn từ ${newRequestRecieved?.sender?.username}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
               });
          });
     }, [requests]);

     useEffect(() => {
          getAllUser(searchTerm)
               .then((response) => {
                    setUsers(response?.data);
               })
               .catch((error) => {
                    console.log(error);
               })
     }, [searchTerm])

     return (
          <>
               <div className="main__chatlist">
                    <button className="btn-conversation " onClick={() => setShowDrawer(true)}>
                         <i className="fa fa-plus"></i>
                         <span>Thêm bạn mới</span>
                    </button>
                    <div className="chatlist__heading">
                         <h4>Lời mời kết bạn</h4>
                         <button className="btn-nobg">
                              <i className="fa fa-ellipsis-h"></i>
                         </button>
                    </div>
                    <div className="chatlist__items">
                         {requests.map((item, index) => {
                              return (
                                   <FriendRequestItem
                                        key={index}
                                        name={item?.sender?.username}
                                        animationDelay={index + 1}
                                        active={item?.sender?.active ? "active" : ""}
                                        isOnline={item?.sender?.isOnline ? "active" : ""}
                                        image={item?.sender?.avatar}
                                        handleAccept={() => { handleResponse(item, "accept") }}
                                        handleDeny={() => { handleResponse(item, "deny") }}
                                   />
                              );
                         })}
                    </div>
               </div>

               <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} backdrop="static">
                    <Offcanvas.Header closeButton>
                         <Offcanvas.Title>Thêm bạn mới</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                         <div className="chatList__search">
                              <div className="search_wrap">
                                   <input
                                        value={searchTerm}
                                        type="text"
                                        placeholder=" Tìm kiếm người dùng"
                                        onChange={(e) => { setSearchTerm(e.target.value) }}
                                   />
                                   <button className="search-btn">
                                        <i className="fa fa-search"></i>
                                   </button>
                              </div>
                         </div>
                         <div className="chatlist__items">
                              {users.map((item, index) => {
                                   return (
                                        <UserItem
                                             key={index}
                                             userId={item?._id}
                                             name={item?.username}
                                             animationDelay={index + 1}
                                             active={item?.active ? "active" : ""}
                                             isOnline={item?.isOnline ? "active" : ""}
                                             image={item?.avatar}
                                             handleAddFriend={() => { addFriend(item?._id) }}
                                        />
                                   );
                              })}
                         </div>
                    </Offcanvas.Body>
               </Offcanvas>
          </>
     );
}

export default FriendRequestList;
