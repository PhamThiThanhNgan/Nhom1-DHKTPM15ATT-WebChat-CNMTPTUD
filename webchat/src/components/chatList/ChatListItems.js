import React from "react";
import { Button } from "react-bootstrap";
import Avatar from "./Avatar";

const ChatListItems = ({
  user,
  animationDelay,
  active,
  isOnline,
  handleSelectedChat,
  chat,
  handleUnfriend
}) => {

  return (
    <>
      <div
        style={{ animationDelay: `0.${animationDelay}s` }}
        onClick={handleSelectedChat}
        className={`chatlist__item ${active
          } `}
      >
        <Avatar
          image={!chat.isGroupChat ? user?.avatar : 'https://cdn-icons-png.flaticon.com/512/74/74577.png'}
          isOnline={isOnline}
        />

        <div className="userMeta">
          <p>{!chat.isGroupChat ? user?.username : chat.chatName}</p>
          <span className="activeTime">32 phút trước</span>
        </div>
      </div>
      {
        handleUnfriend
          ?
          <div>
            <Button style={{ width: '100%', marginBottom: '2rem' }} variant="danger" onClick={handleUnfriend}>Hủy kết bạn</Button>
          </div>
          : ''
      }
    </>
  );
}

export default ChatListItems;