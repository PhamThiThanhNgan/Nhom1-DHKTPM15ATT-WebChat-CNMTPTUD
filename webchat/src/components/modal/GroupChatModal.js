import React, { useEffect, useState } from "react";
import '../nav/Nav.scss'

import { Button, Form, Modal } from "react-bootstrap";
import UserItem from "../userItem/userItem";
import { addUserGroup, createGroupChat, getAllChat, removeFromChat, renameChat } from "../../service/ChatService";
import BadgeUserItem from "./BadgeUserItem";
import { useUserStore } from "../../store/store";
import { toast } from 'react-toastify';
import _ from "lodash";

export default function GroupChatModal({ handleShowModal, showModal, groupChatData }) {

  const [searchFriend, setSearchFriend] = useState('');
  const chats = useUserStore(state => state.chats);
  const updateChats = useUserStore(state => state.updateChats);
  const User = useUserStore(state => state.user);
  const selectedChat = useUserStore(state => state.selectedChat);
  const setSelectedChat = useUserStore(state => state.setSelectedChat);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [friends, setFriends] = useState(User?.friends || []);

  const handleGroup = (userToAdd) => {
    if (!selectedUsers.includes(userToAdd)) {
      if (groupChatData?.users)
      {
        addUserGroup({ chatId: selectedChat?._id, userId: userToAdd._id })
          .then((response) => {
            setSelectedChat(response?.data);
          })
          .catch((error) => {
            toast('Có lỗi xảy ra', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
      } else {
        setSelectedUsers([...selectedUsers, userToAdd]);
      }
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = () => {
    if (!groupName || !selectedUsers) {
      return;
    }
    createGroupChat({ name: groupName, users: JSON.stringify(selectedUsers.map((user) => user._id)) })
      .then((response) => {
        updateChats([response?.data, ...chats]);
        handleShowModal();
      })
      .catch(err => {
        console.error(err);
      })
  };

  const handleChangeName = () => {
    if (!groupName) {
      return;
    }
    renameChat({ chatId: selectedChat?._id, chatName: groupName })
      .then((response) => {
        getAllChat()
          .then((response) => {
            updateChats(response?.data);
          })
          .catch((error) => {
            console.log(error);
          })
        handleShowModal();
        setSelectedChat(response?.data);
      })
      .catch((error) => {
        toast('Có lỗi xảy ra', {
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
  };

  const handleRemove = (user) => {
    if (selectedChat.groupAdmin._id !== User._id && user._id !== User._id) {
      toast('Chỉ người tạo mới có quyền xóa thành viên', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    removeFromChat({ chatId: selectedChat?._id, userId: user._id })
      .then((response) => {
        user._id === User._id ? setSelectedChat() : setSelectedChat(response?.data);
        handleDelete(user);
        getAllChat()
          .then((response) => {
            updateChats(response?.data);
          })
          .catch((error) => {
            console.log(error);
          })
        handleShowModal();
      })
      .catch((error) => {
        toast('Có lỗi xảy ra', {
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
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setSearchFriend(searchWord);
    const newFilter = friends.filter((value) => {
      return value.username.toLowerCase().includes(searchFriend.toLowerCase()) ||
        value.email.toLowerCase().includes(searchFriend.toLowerCase())
    });

    if (searchWord === "") {
      setFriends(User?.friends);
    } else {
      setFriends(newFilter);
    }
  };

  // useEffect(() => {
  //   getAllUser(searchFriend)
  //     .then((response) => {
  //       setUsers(response?.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }, [searchFriend])

  useEffect(() => {
    if (groupChatData) {
      setGroupName(groupChatData?.chatName);
      setSelectedUsers(groupChatData?.users);
    }
  }, [groupChatData])

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered show={showModal} onHide={handleShowModal}
    >
      <Modal.Header>
        <Modal.Title>
          {groupChatData ? 'Cập nhật cuộc trò chuyện' : 'Thêm cuộc trò chuyện'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Tên cuộc trò chuyện</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên cuộc trò chuyện"
              value={groupName}
              autoFocus
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedUsers && selectedUsers.map(user => {
              return (
                <BadgeUserItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    !_.isEmpty(selectedChat) ? handleRemove(user) : handleDelete(user)
                  }}
                />
              )
            })}
          </div>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Thêm thành viên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tìm trong danh sách bạn"
              onChange={handleFilter}
            />
          </Form.Group>
          {friends.map((item, index) => {
            return (
              <UserItem
                key={index}
                name={item?.username}
                animationDelay={index + 1}
                active={item?.active ? "active" : ""}
                isOnline={item?.isOnline ? "active" : ""}
                image={item?.avatar}
                handleSelectedChat={() => handleGroup(item)}
              />
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>

        {groupChatData ? (
          <>
            <Button variant="primary" onClick={handleChangeName}>
              Đổi tên nhóm
            </Button>
            <Button variant="danger" onClick={() => handleRemove(User)}>
              Rời khỏi nhóm
            </Button>
            <Button variant="secondary" onClick={handleShowModal}>
              Hủy
            </Button>
          </>
        )
          : <>
            <Button variant="secondary" onClick={handleShowModal}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Xác Nhận
            </Button>
          </>}
      </Modal.Footer>
    </Modal>
  );

}
